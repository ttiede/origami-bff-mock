import { GraphQLError } from 'graphql'
import { makeToken, getUserIdFromRequest } from './auth.js'
import {
  nextId, logMutation,
  // Getters
  getUsers, findUserByCpf, findUserById,
  getWallets, findWallet,
  getCards, getCardById, getTransactions,
  getNotifications, getNotifPrefs,
  getPartners, getPartnerById, getFavoritePartners, getNearbyPartners,
  getApprovals, getDisputes, getReimbursements,
  getBalanceRequests, getExpenses, getAdvances,
  getReports, getAvailableVouchers, getMyVouchers,
  getGeofenceZones, getDigitalWalletCards,
  getExternalBenefits, getRewardsSummary,
  getSensitiveData, getScheduledDeposits, getNextDeposits, hasNextDepositsEntry,
  getCardDelivery, getKycResult,
  getBanners, getFaqs,
  getStaticSessionsList, getSecurityActivityList,
  // Mutators
  deductWallet, creditWallet, addTransaction,
  setCardStatus, addCard, setCardPin, getCardPin, addCardReplacement,
  markNotifRead, markAllNotifsRead, setNotifPrefs,
  toggleFavorite,
  addDispute, addReimbursement,
  addBalanceRequest, updateBalanceRequestStatus,
  approveAction, rejectAction,
  addExpense, deleteExpense,
  addAdvance, addReport, submitReport,
  buyVoucher,
  addGeofenceZone, removeGeofenceZone, toggleGeofenceZone,
  updateWalletLimit, addScheduledDeposit,
  addToDigitalWallet, removeFromDigitalWallet,
  activateBenefit, redeemReward, reclassifyTransaction,
  trackLogin, trackLogout,
  updateUserPassword, validateUserPassword, updateUserProfile, resetFailedAttempts,
  shouldSimulateFailure,
  // HR
  getClockEntries, getHourBank, getVacationBalance, getVacationHistory,
  getPayslips, getHrEvents, getClockLocks,
  addClockEntry, discardClockEntry, restoreClockEntry, addVacationPeriod,
  // Credit
  getLoans, getLoanById,
  // Travel
  getTravels, getTravelById, getTravelPolicy,
  addTravel, updateTravelStatus, removeTravel, addTravelExpense,
  storeTravelExpense, getTravelExpenses,
  // New endpoint getters
  getBanks, getMobileCarriers, getMarketplaceOffers, getSavingsGoals, getTransportCards,
  // Transaction PIN
  setTransactionPin as storeTransactionPin, getTransactionPin,
  // Rate limiting & daily totals
  trackFailedAttempt, isRateLimited, clearFailedAttempts,
  getDailyTotal, addToDailyTotal, getDailyLimit,
} from './state.js'

// ── GraphQL Error helper ─────────────────────────────────────────────────────
function gqlError(message, code, status) {
  return new GraphQLError(message, { extensions: { code, http: { status } } })
}

// ── Flow token state ──────────────────────────────────────────────────────────
const _flowTokens = new Map()
let _flowTokenCounter = 0

// Tokens OTP / device válidos (espelho do mock Flutter)
const VALID_OTP_CODE    = '1234'
const VALID_DEVICE_TOKEN = '2222'
const VALID_TX_PIN      = '1234'
const VALID_2FA_CODE    = '654321'

// ─── Helper: extrai userId do contexto da request ────────────────────────────
function uid(context) {
  return getUserIdFromRequest(context.request)
}

// ─── Helper: verifica autenticação (Bearer token) ────────────────────────────
function requireAuth(context) {
  const auth = context.request.headers.get('authorization') ?? ''
  if (!auth || !auth.startsWith('Bearer ')) {
    throw gqlError('Autenticação necessária. Envie um Bearer token válido.', 'UNAUTHENTICATED', 401)
  }
  return uid(context)
}

// ─── Helper: monta Transaction mock ──────────────────────────────────────────
function makeTx(prefix, descricao, amount, walletId = 'w1', categoria = 'Pagamento') {
  return {
    id: nextId(prefix),
    descricao,
    valor: -amount,
    tipo: 'debito',
    data: new Date().toISOString(),
    status: 'aprovada',
    categoria,
    merchant: descricao,
    walletId,
    walletNome: null,
  }
}

// ─── Helper: full transaction fields (receipt) ───────────────────────────────
function fullTx(tx) {
  return {
    ...tx,
    direcao: 'debito',
    estabelecimento: tx.merchant,
    walletTipo: null,
    nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null,
    enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null,
    mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null,
  }
}

// ─── Helper: resultado de sucesso ────────────────────────────────────────────
const ok = (extra = {}) => ({ success: true, message: null, ...extra })

// ─── Helper: validate wallet transaction ─────────────────────────────────────
function validateWalletTransaction(userId, walletId, amount, operationName) {
  if (amount == null || amount <= 0) {
    throw gqlError(`Valor inválido para ${operationName}. O valor deve ser maior que zero.`, 'BAD_REQUEST', 400)
  }
  if (!walletId) {
    throw gqlError(`walletId é obrigatório para ${operationName}.`, 'BAD_REQUEST', 400)
  }
  const wallet = findWallet(userId, walletId)
  if (!wallet) {
    throw gqlError(`Carteira '${walletId}' não encontrada.`, 'NOT_FOUND', 404)
  }
  if (amount > wallet.saldo) {
    throw gqlError(
      `Saldo insuficiente na carteira '${wallet.nome}'. Saldo: R$${wallet.saldo.toFixed(2)}, Valor: R$${amount.toFixed(2)}.`,
      'INSUFFICIENT_BALANCE', 422
    )
  }
  // Check daily limit
  const currentDaily = getDailyTotal(userId)
  if (currentDaily + amount > getDailyLimit()) {
    throw gqlError(
      `Limite diário excedido. Limite: R$${getDailyLimit().toFixed(2)}, Já utilizado: R$${currentDaily.toFixed(2)}, Tentativa: R$${amount.toFixed(2)}.`,
      'DAILY_LIMIT_EXCEEDED', 422
    )
  }
  return wallet
}

// ─── Helper: validate card exists ────────────────────────────────────────────
function requireCard(userId, cardId) {
  const cards = getCards(userId)
  const card = cards.find(c => c.id === cardId)
  if (!card) {
    throw gqlError(`Cartão '${cardId}' não encontrado.`, 'NOT_FOUND', 404)
  }
  return card
}

// ─── Helper: check weak PIN ──────────────────────────────────────────────────
function validatePin(pin) {
  const weak = ['0000', '1234', '4321', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999']
  if (weak.includes(pin)) {
    throw gqlError('PIN fraco. Não use sequências simples ou dígitos repetidos.', 'WEAK_PIN', 422)
  }
  // All same digits check
  if (pin.length >= 4 && new Set(pin.split('')).size === 1) {
    throw gqlError('PIN fraco. Não use todos os dígitos iguais.', 'WEAK_PIN', 422)
  }
}

export const resolvers = {
  // ══════════════════════════════════════════════════════════════════
  //  QUERIES — all read from state
  // ══════════════════════════════════════════════════════════════════
  Query: {

    // ── Auth ──────────────────────────────────────────────────────
    findByCpf: (_, { cpf }) => {
      const user = findUserByCpf(cpf)
      if (!user) return null
      return {
        id: user.id, nome: user.nome, cpf: user.cpf,
        email: user.email, telefone: user.telefone,
        empresa: user.empresa, departamento: user.departamento,
        cargo: user.cargo, primeiroAcesso: user.primeiroAcesso,
        bloqueioDefinitivo: user.bloqueioDefinitivo,
        tentativasFalhas: user.tentativasFalhas,
        bloqueioAte: user.bloqueioAte ?? null,
      }
    },

    sessions: (_, __, context) => getStaticSessionsList(uid(context)),
    securityActivity: (_, __, context) => getSecurityActivityList(uid(context)),

    // ── Wallet ────────────────────────────────────────────────────
    wallets: (_, __, context) => getWallets(uid(context)),

    transactions: (_, { walletId, dateFrom, dateTo, categoria, direcao, search, limit, offset } = {}, context) => {
      let txs = getTransactions(uid(context))
      if (walletId)   txs = txs.filter(t => t.walletId === walletId)
      if (dateFrom)   txs = txs.filter(t => t.data >= dateFrom)
      if (dateTo)     txs = txs.filter(t => t.data <= dateTo + 'T23:59:59')
      if (categoria)  txs = txs.filter(t => t.categoria === categoria)
      if (direcao)    txs = txs.filter(t => t.direcao === direcao)
      if (search) {
        const q = search.toLowerCase()
        txs = txs.filter(t =>
          (t.merchant && t.merchant.toLowerCase().includes(q)) ||
          (t.descricao && t.descricao.toLowerCase().includes(q)) ||
          (t.estabelecimento && t.estabelecimento.toLowerCase().includes(q))
        )
      }
      if (offset)     txs = txs.slice(offset)
      if (limit)      txs = txs.slice(0, limit)
      return txs
    },

    balancesByCategory: (_, __, context) => {
      const wallets = getWallets(uid(context))
      return wallets.map(w => ({
        walletId: w.id,
        walletNome: w.nome,
        categoria: w.tipo,
        saldo: w.saldo,
        limite: w.limiteDisponivel,
      }))
    },

    validatePixKey: (_, { chavePix, tipoChave }) => ({
      valid: true,
      nomeTitular: 'Lucas Oliveira Silva',
      banco: 'Origami Bank',
      tipoConta: 'corrente',
      errorMessage: null,
    }),

    nextDeposits: (_, { walletId } = {}, context) => {
      const userId = uid(context)
      const deposits = getNextDeposits(userId)
      // If user has explicit seed data (even empty), return it as-is
      if (deposits.length > 0 || hasNextDepositsEntry(userId)) {
        return walletId ? deposits.filter(d => d.walletId === walletId) : deposits
      }
      // Fallback for users without seed deposits
      const wallets = getWallets(userId)
      const filtered = walletId ? wallets.filter(w => w.id === walletId) : wallets.slice(0, 2)
      return filtered.map((w, i) => ({
        walletId: w.id,
        amount: w.limiteDisponivel,
        scheduledDate: new Date(Date.now() + (i + 1) * 7 * 86400000).toISOString().substring(0, 10),
        description: `Crédito mensal — ${w.nome}`,
      }))
    },

    canPixCashOut: () => true,

    pixCashOutReceipt: (_, { transactionId }) => ({
      id: transactionId,
      descricao: 'PIX Cash Out',
      valor: -200.00,
      data: new Date().toISOString(),
      direcao: 'debito',
      status: 'aprovada',
      categoria: 'PIX Cash Out',
      estabelecimento: null,
      walletId: 'w1',
      walletTipo: 'flexivel',
      nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null,
      enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null,
      mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null,
    }),

    // ── Cards ─────────────────────────────────────────────────────
    cards: (_, __, context) => {
      return getCards(uid(context)).map(({ pin, ...c }) => c)
    },

    cardDelivery: (_, { id: cardId }, context) => {
      const userId = uid(context)
      const delivery = getCardDelivery(cardId, userId)
      if (delivery) return delivery
      // Fallback for cards without seed delivery data
      return {
        cardId,
        status: 'inTransit',
        carrier: 'Correios',
        trackingCode: `BR${Math.abs(cardId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 900000000 + 100000000)}BR`,
        estimatedDate: new Date(Date.now() + 3 * 86400000).toISOString().substring(0, 10),
        deliveryAddress: 'Rua das Flores, 123 — São Paulo, SP',
        events: [
          { description: 'Objeto postado',                        date: new Date(Date.now() - 2 * 86400000).toISOString(), location: 'Barueri, SP'   },
          { description: 'Em trânsito para a cidade de destino',  date: new Date(Date.now() - 1 * 86400000).toISOString(), location: 'São Paulo, SP' },
          { description: 'Objeto em processo de triagem',         date: new Date(Date.now() - 6 * 3600000).toISOString(),  location: 'São Paulo, SP' },
        ],
      }
    },

    revealCard: (_, { id: cardId }) => {
      const data = getSensitiveData()[cardId]
      if (data) return data
      return {
        numeroCompleto: `4000 0000 0000 ${cardId.replace(/\D/g, '').padEnd(4, '0').slice(0, 4)}`,
        cvv: `${Math.floor(Math.random() * 900) + 100}`,
      }
    },

    // ── Notifications ─────────────────────────────────────────────
    notifications: (_, __, context) => getNotifications(uid(context)),

    notificationPreferences: (_, __, context) => getNotifPrefs(uid(context)),

    // ── Partners ──────────────────────────────────────────────────
    partners: (_, args) => getPartners(args),
    nearbyPartners: (_, { lat, lng, radiusKm }) => getNearbyPartners(lat, lng, radiusKm ?? 5),
    partner: (_, { id }) => getPartnerById(id),
    favoritePartners: (_, __, context) => getFavoritePartners(uid(context)),

    // ── Disputes ──────────────────────────────────────────────────
    disputes: () => getDisputes(),

    // ── Reimbursements ────────────────────────────────────────────
    reimbursements: () => getReimbursements(),

    // ── Balance Requests ──────────────────────────────────────────
    balanceRequests: (_, { walletId } = {}) => {
      const all = getBalanceRequests()
      return walletId ? all.filter(b => b.walletId === walletId) : all
    },

    // ── KYC ───────────────────────────────────────────────────────
    kycStatus: (_, __, context) => {
      const userId = uid(context)
      const result = getKycResult(userId)
      if (result) return result
      // Fallback for users without seed KYC data
      return {
        id: 'kyc-default',
        status: 'approved',
        cpfValid: true,
        documentValid: true,
        certifaceScore: 0.98,
        rejectionReason: null,
        submittedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        reviewedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      }
    },

    // ── Approvals ─────────────────────────────────────────────────
    approvals: (_, { status } = {}) => {
      const all = getApprovals()
      return status ? all.filter(a => a.status === status) : all
    },

    approvalsPendingCount: () =>
      getApprovals().filter(a => a.status === 'pendente').length,

    // ── External Benefits ─────────────────────────────────────────
    externalBenefits: () => getExternalBenefits(),
    explainBenefit: (_, { id }) => getExternalBenefits().find(b => b.id === id) ?? null,

    // ── Rewards ───────────────────────────────────────────────────
    rewardsSummary: (_, __, context) => getRewardsSummary(uid(context)),

    // ── Home ──────────────────────────────────────────────────────
    productBanners: () => getBanners(),

    // ── Digital Wallet ────────────────────────────────────────────
    digitalWalletCards: () => getDigitalWalletCards(),

    // ── Help Center ───────────────────────────────────────────────
    faqs: () => getFaqs(),

    // ── Expenses ──────────────────────────────────────────────────
    expenses: () => getExpenses(),

    // ── Advances ──────────────────────────────────────────────────
    advances: () => getAdvances(),

    // ── Reports ───────────────────────────────────────────────────
    expenseReports: () => getReports(),

    // ── Vouchers ──────────────────────────────────────────────────
    availableVouchers: () => getAvailableVouchers(),
    myVouchers: () => getMyVouchers(),

    // ── Geofencing ────────────────────────────────────────────────
    geofenceZones: () => getGeofenceZones(),

    // ── HR ──────────────────────────────────────────────────────
    timeSheet: (_, { date }) => {
      const entries = getClockEntries().filter(e => e.timestamp.startsWith(date))
      return {
        date,
        entries,
        workedMinutes: 480,
        extraMinutes: 30,
        nightMinutes: 0,
        breakMinutes: 64,
      }
    },

    hourBank: () => getHourBank(),

    vacationBalance: () => getVacationBalance(),

    vacationHistory: () => getVacationHistory(),

    payslips: (_, { year }) => getPayslips().filter(p => p.year === year),

    hrEvents: (_, { month, year }) => {
      return getHrEvents().filter(e => {
        const d = new Date(e.date)
        return d.getMonth() + 1 === month && d.getFullYear() === year
      })
    },

    clockLocks: () => getClockLocks(),

    // ── Credit ─────────────────────────────────────────────────
    loans: () => getLoans(),

    loanDetail: (_, { id }) => {
      const loan = getLoanById(id)
      if (!loan) throw gqlError(`Empréstimo '${id}' não encontrado.`, 'NOT_FOUND', 404)
      return loan
    },

    creditSimulation: (_, { amount, installments, type }) => {
      if (amount < 500) {
        throw gqlError('Valor mínimo para simulação é R$500,00.', 'BAD_REQUEST', 400)
      }
      if (amount > 50000) {
        throw gqlError('Valor máximo para simulação é R$50.000,00.', 'BAD_REQUEST', 400)
      }
      const interestRate = 0.018 // 1.8% monthly
      const monthlyPayment = parseFloat((amount * interestRate / (1 - Math.pow(1 + interestRate, -installments))).toFixed(2))
      const totalCost = parseFloat((monthlyPayment * installments).toFixed(2))
      const iofTax = parseFloat((amount * 0.0038 + amount * 0.000082 * Math.min(installments * 30, 365)).toFixed(2))
      return {
        id: nextId('sim'),
        type,
        amount,
        installments,
        monthlyPayment,
        interestRate,
        totalCost,
        iofTax,
      }
    },

    // ── Travel ─────────────────────────────────────────────────
    travels: () => getTravels(),

    travelDetail: (_, { id }) => {
      const travel = getTravelById(id)
      if (!travel) throw gqlError(`Viagem '${id}' não encontrada.`, 'NOT_FOUND', 404)
      return travel
    },

    travelPolicy: () => getTravelPolicy(),

    // ── Missing Query resolvers ────────────────────────────────
    me: (_, __, context) => {
      const auth = context.request?.headers?.get('authorization') ?? '';
      const tokenNum = auth.replace('Bearer origami-mock-', '');
      const user = getUsers().find(u => u.id === tokenNum);
      return user || null;
    },

    requiredCreditFiles: (_, { type }) => {
      const files = [
        { id: 'rf-1', type: 'identity', label: 'Documento de identidade', description: 'RG ou CNH (frente e verso)', required: true, accepted: false },
        { id: 'rf-2', type: 'address', label: 'Comprovante de endereço', description: 'Conta de luz, água ou telefone (últimos 3 meses)', required: true, accepted: false },
        { id: 'rf-3', type: 'income', label: 'Comprovante de renda', description: 'Holerite ou declaração de IR', required: true, accepted: false },
      ];
      if (type === 'consignado') {
        files.push({ id: 'rf-4', type: 'payroll', label: 'Autorização de consignação', description: 'Documento assinado pelo RH', required: true, accepted: false });
      }
      return files;
    },

    timeSheetRange: (_, { from, to }) => {
      const sheets = [];
      let d = new Date(from);
      const end = new Date(to);
      while (d <= end) {
        if (d.getDay() !== 0 && d.getDay() !== 6) {
          sheets.push({
            date: d.toISOString().split('T')[0],
            entries: [],
            workedMinutes: 480 + Math.floor(Math.random() * 30),
            extraMinutes: Math.floor(Math.random() * 20),
            nightMinutes: 0,
            breakMinutes: 60,
          });
        }
        d.setDate(d.getDate() + 1);
      }
      return sheets;
    },

    getEvents: (_, args) => resolvers.Query.hrEvents(_, args),

    // ── Spending Challenge ──────────────────────────────────────────
    spendingChallenge: () => ({
      id: 'challenge-1',
      title: 'Gaste menos de R$500 em alimentação',
      target: 500.0,
      current: 320.0,
      category: 'alimentacao',
    }),
  },

  // ══════════════════════════════════════════════════════════════════
  //  MUTATIONS — all modify state
  // ══════════════════════════════════════════════════════════════════
  Mutation: {

    // ── Auth ──────────────────────────────────────────────────────
    login: (_, { input }) => {
      const { cpf, password } = input

      // Rate limit check
      const rateLimitKey = `login:${cpf}`
      if (isRateLimited(rateLimitKey)) {
        logMutation('login', `RATE LIMITED: cpf ${cpf}`)
        throw gqlError(
          'Muitas tentativas de login. Conta temporariamente bloqueada por 15 minutos.',
          'RATE_LIMITED', 429
        )
      }

      const user = findUserByCpf(cpf)
      if (!user) {
        logMutation('login', `FAILED: cpf ${cpf} not found`)
        trackFailedAttempt(rateLimitKey)
        throw gqlError('CPF não encontrado.', 'NOT_FOUND', 404)
      }
      if (user.bloqueioDefinitivo) {
        logMutation('login', `FAILED: user:${user.id} blocked permanently`)
        throw gqlError(
          'Conta bloqueada definitivamente. Entre em contato com o suporte.',
          'FORBIDDEN', 403
        )
      }
      if (user.senha === null) {
        trackLogin(user.id)
        clearFailedAttempts(rateLimitKey)
        logMutation('login', `user:${user.id} | first-access`)
        return {
          accessToken: `origami-mock-${user.id}-first-access`,
          refreshToken: `origami-refresh-${user.id}`,
          expiresIn: 3600,
          user: {
            id: String(user.id), fullName: user.nome,
            maskedCpf: `***.${user.cpf.slice(3, 9)}-**`,
            email: user.email, roles: ['employee'],
          },
        }
      }
      // Simulate password validation (in production this would be bcrypt/argon2)
      const passwordValid = password === user.senha // Mock: plaintext comparison
      if (!passwordValid) {
        const attempt = trackFailedAttempt(rateLimitKey)
        logMutation('login', `FAILED: wrong password for cpf ${cpf} (user:${user.id}) attempt:${attempt.count}`)
        throw gqlError('Senha incorreta.', 'UNAUTHORIZED', 401)
      }
      trackLogin(user.id)
      resetFailedAttempts(user.id)
      clearFailedAttempts(rateLimitKey)
      logMutation('login', `user:${user.id} | success`)
      return {
        accessToken: makeToken(user.id),
        refreshToken: `origami-refresh-${user.id}`,
        expiresIn: 3600,
        user: {
          id: String(user.id), fullName: user.nome,
          maskedCpf: `***.${user.cpf.slice(3, 9)}-**`,
          email: user.email, roles: ['employee'],
        },
      }
    },

    logout: (_, { sessionId } = {}, context) => {
      const userId = requireAuth(context)
      trackLogout(userId)
      logMutation('logout', `user:${userId}`)
      return ok()
    },

    forgotPassword: (_, { cpf }) => {
      const user = findUserByCpf(cpf)
      if (!user) {
        throw gqlError('CPF não encontrado.', 'NOT_FOUND', 404)
      }
      return ok()
    },

    verifyOtp: (_, { otp }) => {
      const rateLimitKey = `otp:${otp}`
      if (isRateLimited(rateLimitKey)) {
        throw gqlError(
          'Muitas tentativas de verificação. Aguarde 15 minutos.',
          'RATE_LIMITED', 429
        )
      }
      if (otp === '0000' || otp !== VALID_OTP_CODE) {
        trackFailedAttempt(rateLimitKey)
        throw gqlError('Código OTP inválido.', 'UNAUTHORIZED', 401)
      }
      clearFailedAttempts(rateLimitKey)
      return { success: true, message: null, resetTicket: `mock-reset-ticket-${Date.now()}` }
    },

    resetPassword: (_, { input: { resetTicket, newPassword } }) => {
      if (!resetTicket || resetTicket.length === 0) {
        throw gqlError('Reset ticket é obrigatório.', 'BAD_REQUEST', 400)
      }
      if (!newPassword || newPassword.length < 8) {
        throw gqlError('A nova senha deve ter no mínimo 8 caracteres.', 'BAD_REQUEST', 400)
      }
      logMutation('resetPassword', `ticket:${resetTicket.slice(0, 20)}...`)
      return ok()
    },

    updatePassword: (_, { input }, context) => {
      requireAuth(context)
      if (!input || !input.cpf || !input.newPassword) {
        throw gqlError('CPF e nova senha são obrigatórios.', 'BAD_REQUEST', 400)
      }
      if (input.newPassword.length < 8) {
        throw gqlError('A nova senha deve ter no mínimo 8 caracteres.', 'BAD_REQUEST', 400)
      }
      // Validate current password
      if (input.currentPassword && !validateUserPassword(input.cpf, input.currentPassword)) {
        throw gqlError('Senha atual incorreta.', 'UNAUTHORIZED', 401)
      }
      if (input.newPassword === input.currentPassword) {
        throw gqlError('A nova senha deve ser diferente da senha atual.', 'BAD_REQUEST', 400)
      }
      updateUserPassword(input.cpf, input.newPassword)
      logMutation('updatePassword', `cpf:${input.cpf}`)
      return ok()
    },

    validateCode: (_, { code }) => {
      if (code === VALID_OTP_CODE) return ok()
      throw gqlError('Código inválido.', 'UNAUTHORIZED', 401)
    },

    validateDeviceToken: (_, { token }) => ({
      success: token === VALID_DEVICE_TOKEN,
      message: token === VALID_DEVICE_TOKEN ? null : 'Token inválido',
      deviceTrusted: token === VALID_DEVICE_TOKEN,
    }),

    terminateSession: (_, __, context) => {
      requireAuth(context)
      return ok()
    },

    updateProfile: (_, { nome, email, telefone }, context) => {
      const userId = requireAuth(context)
      const updates = {}
      if (nome) updates.nome = nome
      if (email) updates.email = email
      if (telefone) updates.telefone = telefone
      updateUserProfile(userId, updates)
      logMutation('updateProfile', `user:${userId} | updates: ${JSON.stringify(updates)}`)
      return ok()
    },

    setTransactionPin: (_, { pin }, context) => {
      const userId = requireAuth(context)
      if (!pin || pin.length < 4) {
        throw gqlError('O PIN deve ter no mínimo 4 dígitos.', 'BAD_REQUEST', 400)
      }
      storeTransactionPin(userId, pin)
      logMutation('setTransactionPin', `user:${userId} → PIN set`)
      return ok()
    },

    validateTransactionPin: (_, { pin }, context) => {
      const userId = requireAuth(context)
      const rateLimitKey = `txpin:${userId}`
      if (isRateLimited(rateLimitKey)) {
        throw gqlError(
          'Muitas tentativas de PIN. Aguarde 15 minutos.',
          'RATE_LIMITED', 429
        )
      }
      // Check user's stored PIN first, fall back to default valid PIN
      const storedPin = getTransactionPin(userId)
      const validPin = storedPin ?? VALID_TX_PIN
      if (pin !== validPin) {
        trackFailedAttempt(rateLimitKey)
        throw gqlError('PIN de transação incorreto.', 'UNAUTHORIZED', 401)
      }
      clearFailedAttempts(rateLimitKey)
      return ok()
    },

    toggle2FA: (_, __, context) => {
      requireAuth(context)
      return ok()
    },

    verify2FACode: (_, { code }, context) => {
      requireAuth(context)
      if (code !== VALID_2FA_CODE) {
        throw gqlError('Código 2FA inválido.', 'UNAUTHORIZED', 401)
      }
      return ok()
    },

    requestDataDeletion: (_, __, context) => {
      requireAuth(context)
      return { success: true, message: null, protocol: `DEL-${Date.now()}` }
    },

    validatePhone: (_, { phone }) => {
      if (phone.replace(/\D/g, '').length < 10) {
        throw gqlError('Telefone inválido. Mínimo 10 dígitos.', 'BAD_REQUEST', 400)
      }
      return ok()
    },

    recoverTransactionPin: (_, __, context) => {
      requireAuth(context)
      return ok()
    },

    updateTransactionPin: (_, { recoveryCode, newPin }, context) => {
      requireAuth(context)
      if (recoveryCode !== VALID_OTP_CODE) {
        throw gqlError('Código de recuperação inválido.', 'UNAUTHORIZED', 401)
      }
      if (!newPin || newPin.length < 4) {
        throw gqlError('O novo PIN deve ter no mínimo 4 dígitos.', 'BAD_REQUEST', 400)
      }
      return ok()
    },

    // ── Wallet ────────────────────────────────────────────────────
    pixTransfer: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (shouldSimulateFailure()) {
        logMutation('pixTransfer', `user:${userId} | SIMULATED FAILURE`)
        throw gqlError('Falha simulada no servidor.', 'INTERNAL_ERROR', 500)
      }
      if (!input.chavePix) {
        throw gqlError('Chave PIX é obrigatória.', 'BAD_REQUEST', 400)
      }
      validateWalletTransaction(userId, input.walletId, input.amount, 'PIX')
      const wallet = deductWallet(userId, input.walletId, input.amount)
      addToDailyTotal(userId, input.amount)
      const tx = makeTx('pix', `PIX para ${input.chavePix}`, input.amount, input.walletId, 'PIX')
      addTransaction(userId, tx)
      logMutation('pixTransfer', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return fullTx(tx)
    },

    processQrPayment: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (shouldSimulateFailure()) {
        logMutation('processQrPayment', `user:${userId} | SIMULATED FAILURE`)
        throw gqlError('Falha simulada no servidor.', 'INTERNAL_ERROR', 500)
      }
      if (!(input.qrData || input.qrCode)) {
        throw gqlError('QR Code é obrigatório.', 'BAD_REQUEST', 400)
      }
      validateWalletTransaction(userId, input.walletId, input.amount, 'QR Payment')
      const wallet = deductWallet(userId, input.walletId, input.amount)
      addToDailyTotal(userId, input.amount)
      const tx = makeTx('qr', 'Pagamento QR Code', input.amount, input.walletId, 'QR Code')
      addTransaction(userId, tx)
      logMutation('processQrPayment', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return fullTx(tx)
    },

    payBoleto: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (shouldSimulateFailure()) {
        logMutation('payBoleto', `user:${userId} | SIMULATED FAILURE`)
        throw gqlError('Falha simulada no servidor.', 'INTERNAL_ERROR', 500)
      }
      if (!(input.barcode || input.barCode)) {
        throw gqlError('Código de barras do boleto é obrigatório.', 'BAD_REQUEST', 400)
      }
      validateWalletTransaction(userId, input.walletId, input.amount, 'Boleto')
      const wallet = deductWallet(userId, input.walletId, input.amount)
      addToDailyTotal(userId, input.amount)
      const tx = makeTx('bol', 'Pagamento de Boleto', input.amount, input.walletId, 'Boleto')
      addTransaction(userId, tx)
      logMutation('payBoleto', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return fullTx(tx)
    },

    mobileRecharge: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (shouldSimulateFailure()) {
        logMutation('mobileRecharge', `user:${userId} | SIMULATED FAILURE`)
        throw gqlError('Falha simulada no servidor.', 'INTERNAL_ERROR', 500)
      }
      if (!input.phone) {
        throw gqlError('Número do telefone é obrigatório.', 'BAD_REQUEST', 400)
      }
      validateWalletTransaction(userId, input.walletId, input.amount, 'Recarga')
      const wallet = deductWallet(userId, input.walletId, input.amount)
      addToDailyTotal(userId, input.amount)
      const tx = makeTx('rec', `Recarga ${input.phone}`, input.amount, input.walletId, 'Recarga')
      addTransaction(userId, tx)
      logMutation('mobileRecharge', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return fullTx(tx)
    },

    reallocateBenefit: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (!input.amount || input.amount <= 0) {
        throw gqlError('Valor deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      if (!input.fromWalletId || !input.toWalletId) {
        throw gqlError('Carteiras de origem e destino são obrigatórias.', 'BAD_REQUEST', 400)
      }
      const fromWallet = findWallet(userId, input.fromWalletId)
      if (!fromWallet) throw gqlError(`Carteira de origem '${input.fromWalletId}' não encontrada.`, 'NOT_FOUND', 404)
      const toWallet = findWallet(userId, input.toWalletId)
      if (!toWallet) throw gqlError(`Carteira de destino '${input.toWalletId}' não encontrada.`, 'NOT_FOUND', 404)
      if (input.amount > fromWallet.saldo) {
        throw gqlError(
          `Saldo insuficiente na carteira '${fromWallet.nome}'. Saldo: R$${fromWallet.saldo.toFixed(2)}.`,
          'INSUFFICIENT_BALANCE', 422
        )
      }
      const from = deductWallet(userId, input.fromWalletId, input.amount)
      const to = creditWallet(userId, input.toWalletId, input.amount)
      logMutation('reallocateBenefit', `user:${userId} | ${input.fromWalletId} -R$${input.amount} → ${input.toWalletId} +R$${input.amount} | from:R$${from?.saldo ?? '?'} to:R$${to?.saldo ?? '?'}`)
      return !!(from && to)
    },

    scheduleDeposit: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (!input.amount || input.amount <= 0) {
        throw gqlError('Valor deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      if (!input.walletId) {
        throw gqlError('walletId é obrigatório.', 'BAD_REQUEST', 400)
      }
      if (!input.scheduledDate) {
        throw gqlError('Data agendada é obrigatória.', 'BAD_REQUEST', 400)
      }
      const wallet = findWallet(userId, input.walletId)
      if (!wallet) throw gqlError(`Carteira '${input.walletId}' não encontrada.`, 'NOT_FOUND', 404)
      addScheduledDeposit(userId, input.walletId, input.amount, input.scheduledDate)
      logMutation('scheduleDeposit', `user:${userId} | wallet:${input.walletId} R$${input.amount} on ${input.scheduledDate}`)
      return true
    },

    updateWalletLimit: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (input.newLimit == null || input.newLimit < 0) {
        throw gqlError('O novo limite deve ser um valor positivo.', 'BAD_REQUEST', 400)
      }
      if (!input.walletId) {
        throw gqlError('walletId é obrigatório.', 'BAD_REQUEST', 400)
      }
      const existing = findWallet(userId, input.walletId)
      if (!existing) throw gqlError(`Carteira '${input.walletId}' não encontrada.`, 'NOT_FOUND', 404)
      const wallet = updateWalletLimit(userId, input.walletId, input.newLimit)
      logMutation('updateWalletLimit', `user:${userId} | wallet:${input.walletId} → limit:R$${input.newLimit}`)
      return wallet ? { ...wallet } : null
    },

    reclassifyTransaction: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (!input.transactionId || !input.newCategory) {
        throw gqlError('transactionId e newCategory são obrigatórios.', 'BAD_REQUEST', 400)
      }
      const result = reclassifyTransaction(userId, input.transactionId, input.newCategory)
      if (!result) {
        throw gqlError(`Transação '${input.transactionId}' não encontrada.`, 'NOT_FOUND', 404)
      }
      logMutation('reclassifyTransaction', `user:${userId} | tx:${input.transactionId} → ${input.newCategory}`)
      return result
    },

    cashOut: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (shouldSimulateFailure()) {
        logMutation('cashOut', `user:${userId} | SIMULATED FAILURE`)
        throw gqlError('Falha simulada no servidor.', 'INTERNAL_ERROR', 500)
      }
      validateWalletTransaction(userId, input.walletId, input.amount, 'Saque')
      const wallet = deductWallet(userId, input.walletId, input.amount)
      addToDailyTotal(userId, input.amount)
      const tx = makeTx('cashout', 'Saque bancário', input.amount, input.walletId, 'Saque')
      addTransaction(userId, tx)
      logMutation('cashOut', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return fullTx(tx)
    },

    pixCashOutPreview: (_, { input }, context) => {
      requireAuth(context)
      if (!input.chavePix) {
        throw gqlError('Chave PIX é obrigatória.', 'BAD_REQUEST', 400)
      }
      if (!input.amount || input.amount <= 0) {
        throw gqlError('Valor deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      return {
        chavePix: input.chavePix,
        tipoChave: input.tipoChave,
        nomeTitular: 'Lucas Oliveira Silva',
        banco: 'Origami Bank',
        agencia: '0001',
        conta: '12345-6',
        amount: input.amount,
        fee: parseFloat((input.amount * 0.015).toFixed(2)),
        totalDebited: parseFloat((input.amount * 1.015).toFixed(2)),
        previewId: nextId('preview'),
      }
    },

    executePixCashOut: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (shouldSimulateFailure()) {
        logMutation('executePixCashOut', `user:${userId} | SIMULATED FAILURE`)
        throw gqlError('Falha simulada no servidor.', 'INTERNAL_ERROR', 500)
      }
      if (!input.amount || input.amount <= 0) {
        throw gqlError('Valor deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      const totalDebited = parseFloat((input.amount * 1.015).toFixed(2))
      validateWalletTransaction(userId, input.walletId, totalDebited, 'PIX Cash Out')
      const wallet = deductWallet(userId, input.walletId, totalDebited)
      addToDailyTotal(userId, totalDebited)
      const tx = makeTx('cashout', `PIX Cash Out para ${input.chavePix}`, input.amount, input.walletId, 'PIX Cash Out')
      addTransaction(userId, tx)
      logMutation('executePixCashOut', `user:${userId} | wallet:${input.walletId} -R$${totalDebited} (fee incl.) → R$${wallet?.saldo ?? '?'}`)
      return fullTx(tx)
    },

    statementExport: (_, { input }, context) => {
      requireAuth(context)
      return {
        url: `https://mock.origami.com.br/statements/extrato.${input.format.toLowerCase()}`,
        format: input.format,
      }
    },

    // ── Cards ─────────────────────────────────────────────────────
    blockCard: (_, { id: cardId }, context) => {
      const userId = requireAuth(context)
      const card = requireCard(userId, cardId)
      if (card.status === 'bloqueado') {
        throw gqlError('Cartão já está bloqueado.', 'CONFLICT', 409)
      }
      setCardStatus(userId, cardId, 'bloqueado')
      logMutation('blockCard', `user:${userId} | card:${cardId} → bloqueado`)
      const { pin, ...safe } = card
      return { ...safe, status: 'bloqueado' }
    },

    unblockCard: (_, { id: cardId }, context) => {
      const userId = requireAuth(context)
      const card = requireCard(userId, cardId)
      if (card.status === 'ativo') {
        throw gqlError('Cartão já está ativo.', 'CONFLICT', 409)
      }
      setCardStatus(userId, cardId, 'ativo')
      logMutation('unblockCard', `user:${userId} | card:${cardId} → ativo`)
      const { pin, ...safe } = card
      return { ...safe, status: 'ativo' }
    },

    createVirtualCard: (_, __, context) => {
      const userId = requireAuth(context)
      const user = findUserById(userId)
      const name = user.nome.split(' ').map((w, i) => i < 2 ? w : w[0]).join(' ').toUpperCase()
      const newCard = {
        id: nextId('c'),
        tipo: 'virtual',
        status: 'ativo',
        bandeira: 'visa',
        ultimosDigitos: String(Math.floor(Math.random() * 9000) + 1000),
        nomePortador: name,
        validade: '06/30',
        carteirasVinculadas: ['Flexível'],
        contactless: false,
        pin: '0000',
      }
      addCard(userId, newCard)
      logMutation('createVirtualCard', `user:${userId} | card:${newCard.id} final:${newCard.ultimosDigitos}`)
      const { pin, ...safe } = newCard
      return safe
    },

    activateCard: (_, { id: cardId }, context) => {
      const userId = requireAuth(context)
      const card = requireCard(userId, cardId)
      if (card.status === 'ativo') {
        throw gqlError('Cartão já está ativo.', 'CONFLICT', 409)
      }
      setCardStatus(userId, cardId, 'ativo')
      logMutation('activateCard', `user:${userId} | card:${cardId} → ativo`)
      const { pin, ...safe } = card
      return { ...safe, status: 'ativo' }
    },

    validateCardPin: (_, { id, pin }, context) => {
      const userId = requireAuth(context)
      requireCard(userId, id)
      const storedPin = getCardPin(userId, id)
      if (storedPin === null) {
        return { success: false, message: 'Este cartão não possui PIN definido' }
      }
      if (storedPin !== pin) {
        return { success: false, message: 'PIN incorreto' }
      }
      return ok()
    },

    changeCardPin: (_, { id, newPin }, context) => {
      const userId = requireAuth(context)
      requireCard(userId, id)
      validatePin(newPin)
      setCardPin(userId, id, newPin)
      logMutation('changeCardPin', `user:${userId} | card:${id} → PIN changed`)
      return ok()
    },

    requestCardReplacement: (_, { id, reason }, context) => {
      const userId = requireAuth(context)
      requireCard(userId, id)
      if (!reason) {
        throw gqlError('Motivo da substituição é obrigatório.', 'BAD_REQUEST', 400)
      }
      addCardReplacement(id, reason)
      setCardStatus(userId, id, 'substituicao_solicitada')
      const protocol = `REP-${Date.now().toString().slice(-6)}`
      logMutation('requestCardReplacement', `user:${userId} | card:${id} reason:${reason} protocol:${protocol}`)
      return { success: true, message: protocol }
    },

    toggleInternationalMode: (_, __, context) => {
      requireAuth(context)
      return true
    },

    // ── Notifications ─────────────────────────────────────────────
    markNotificationRead: (_, { id }, context) => {
      const userId = requireAuth(context)
      markNotifRead(userId, id)
      logMutation('markNotificationRead', `user:${userId} | notif:${id} → lida=true`)
      return ok()
    },

    markAllNotificationsRead: (_, __, context) => {
      const userId = requireAuth(context)
      markAllNotifsRead(userId)
      logMutation('markAllNotificationsRead', `user:${userId} | all → lida=true`)
      return ok()
    },

    updateNotificationPreferences: (_, { input }, context) => {
      const userId = requireAuth(context)
      setNotifPrefs(userId, input)
      logMutation('updateNotificationPreferences', `user:${userId} | push:${input.pushEnabled} email:${input.emailEnabled} sms:${input.smsEnabled}`)
      return input
    },

    // ── Partners ──────────────────────────────────────────────────
    toggleFavoritePartner: (_, { partnerId: id }, context) => {
      const userId = requireAuth(context)
      const result = toggleFavorite(userId, id)
      logMutation('toggleFavoritePartner', `user:${userId} | partner:${id} → ${result ? 'added' : 'removed'}`)
      return result
    },

    // ── Disputes ──────────────────────────────────────────────────
    submitDispute: (_, { transactionId, description, amount, merchantName }, context) => {
      requireAuth(context)
      if (!transactionId) {
        throw gqlError('transactionId é obrigatório.', 'BAD_REQUEST', 400)
      }
      if (amount == null || amount <= 0) {
        throw gqlError('Valor da contestação deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      const d = {
        id: nextId('disp'),
        transactionId,
        description,
        amount,
        merchantName: merchantName ?? 'Estabelecimento',
        status: 'aberta',
        date: new Date().toISOString(),
        events: [{ date: new Date().toISOString(), description: 'Contestação aberta', status: 'aberta' }],
      }
      addDispute(d)
      logMutation('submitDispute', `disp:${d.id} | tx:${transactionId} R$${amount}`)
      return d
    },

    // ── Reimbursements ────────────────────────────────────────────
    submitReimbursement: (_, { category, amount, date, description, receiptUrl }, context) => {
      requireAuth(context)
      if (!category) {
        throw gqlError('Categoria é obrigatória.', 'BAD_REQUEST', 400)
      }
      if (amount == null || amount <= 0) {
        throw gqlError('Valor do reembolso deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      if (!date) {
        throw gqlError('Data é obrigatória.', 'BAD_REQUEST', 400)
      }
      const r = {
        id: nextId('reimb'),
        category, amount, date, description,
        status: 'aguardando',
        receiptUrl: receiptUrl ?? null,
        resolvedAt: null,
      }
      addReimbursement(r)
      logMutation('submitReimbursement', `reimb:${r.id} | R$${amount} cat:${category}`)
      return r
    },

    // ── Balance Requests ──────────────────────────────────────────
    createBalanceRequest: (_, { input }, context) => {
      requireAuth(context)
      if (!input.walletId) {
        throw gqlError('walletId é obrigatório.', 'BAD_REQUEST', 400)
      }
      if (!input.amount || input.amount <= 0) {
        throw gqlError('Valor deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      const r = {
        id: nextId('br'),
        walletId: input.walletId,
        amount: input.amount,
        status: 'aguardando',
        justificativa: input.justificativa ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        approvedBy: null,
        rejectionReason: null,
      }
      addBalanceRequest(r)
      logMutation('createBalanceRequest', `br:${r.id} | wallet:${input.walletId} R$${input.amount}`)
      return r
    },

    updateBalanceRequest: (_, { input }, context) => {
      requireAuth(context)
      if (!input.requestId || !input.status) {
        throw gqlError('requestId e status são obrigatórios.', 'BAD_REQUEST', 400)
      }
      const req = updateBalanceRequestStatus(input.requestId, input.status, input.rejectionReason)
      if (!req) {
        throw gqlError(`Solicitação '${input.requestId}' não encontrada.`, 'NOT_FOUND', 404)
      }
      logMutation('updateBalanceRequest', `br:${input.requestId} → ${input.status}${input.rejectionReason ? ' reason:' + input.rejectionReason : ''}`)
      return req
    },

    // ── Digital Wallet ────────────────────────────────────────────
    addToGooglePay: (_, { cardId }, context) => {
      requireAuth(context)
      const result = addToDigitalWallet(cardId, 'google_pay')
      if (!result) {
        throw gqlError(`Cartão '${cardId}' não encontrado.`, 'NOT_FOUND', 404)
      }
      logMutation('addToGooglePay', `card:${cardId} → provisioned`)
      return result
    },

    addToSamsungPay: (_, { cardId }, context) => {
      requireAuth(context)
      const result = addToDigitalWallet(cardId, 'samsung_pay')
      if (!result) {
        throw gqlError(`Cartão '${cardId}' não encontrado.`, 'NOT_FOUND', 404)
      }
      logMutation('addToSamsungPay', `card:${cardId} → provisioned`)
      return result
    },

    removeFromDigitalWallet: (_, { cardId, provider }, context) => {
      requireAuth(context)
      const result = removeFromDigitalWallet(cardId, provider)
      if (!result) {
        throw gqlError(`Cartão '${cardId}' com provider '${provider}' não encontrado.`, 'NOT_FOUND', 404)
      }
      logMutation('removeFromDigitalWallet', `card:${cardId} provider:${provider} → removed`)
      return result
    },

    // ── KYC ───────────────────────────────────────────────────────
    validateCpfBigDataCorp: (_, __, context) => {
      requireAuth(context)
      return true
    },

    submitKycDocuments: (_, __, context) => {
      requireAuth(context)
      return {
        id: nextId('kyc-doc'),
        status: 'aguardando_analise',
        cpfValid: true,
        documentValid: null,
        certifaceScore: null,
        rejectionReason: null,
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
      }
    },

    submitCertifaceSelfie: (_, __, context) => {
      requireAuth(context)
      return {
        id: nextId('kyc-selfie'),
        status: 'aprovada',
        cpfValid: true,
        documentValid: true,
        certifaceScore: 0.98,
        rejectionReason: null,
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
      }
    },

    // ── Approvals ─────────────────────────────────────────────────
    approveAction: (_, { id }, context) => {
      requireAuth(context)
      const item = approveAction(id)
      if (!item) {
        throw gqlError(`Aprovação '${id}' não encontrada.`, 'NOT_FOUND', 404)
      }
      logMutation('approveAction', `appr:${id} → aprovada at ${item.decidedAt}`)
      return item
    },

    rejectAction: (_, { id, reason }, context) => {
      requireAuth(context)
      if (!reason) {
        throw gqlError('Motivo da rejeição é obrigatório.', 'BAD_REQUEST', 400)
      }
      const item = rejectAction(id, reason)
      if (!item) {
        throw gqlError(`Aprovação '${id}' não encontrada.`, 'NOT_FOUND', 404)
      }
      logMutation('rejectAction', `appr:${id} → reprovado reason:${reason}`)
      return item
    },

    // ── Feedback ──────────────────────────────────────────────────
    submitFeedback: (_, __, context) => {
      requireAuth(context)
      return ok()
    },

    // ── Rewards ───────────────────────────────────────────────────
    redeemReward: (_, { rewardId } = {}, context) => {
      const userId = requireAuth(context)
      if (!rewardId) {
        throw gqlError('rewardId é obrigatório.', 'BAD_REQUEST', 400)
      }
      const newPoints = redeemReward(userId, rewardId)
      logMutation('redeemReward', `user:${userId} | reward:${rewardId} → pts:${newPoints}`)
      return ok()
    },

    // ── Expenses ──────────────────────────────────────────────────
    createExpense: (_, { input }, context) => {
      requireAuth(context)
      if (!input.description) {
        throw gqlError('Descrição é obrigatória.', 'BAD_REQUEST', 400)
      }
      if (!input.amount || input.amount <= 0) {
        throw gqlError('Valor deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      if (!input.date) {
        throw gqlError('Data é obrigatória.', 'BAD_REQUEST', 400)
      }
      if (!input.category) {
        throw gqlError('Categoria é obrigatória.', 'BAD_REQUEST', 400)
      }
      const e = {
        id: nextId('exp'),
        description: input.description,
        amount: input.amount,
        date: input.date,
        category: input.category,
        receiptUrl: input.receiptUrl ?? null,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        merchant: input.merchant ?? null,
      }
      addExpense(e)
      logMutation('createExpense', `exp:${e.id} | R$${e.amount} cat:${e.category}`)
      return e
    },

    deleteExpense: (_, { id }, context) => {
      requireAuth(context)
      const removed = deleteExpense(id)
      if (!removed) {
        throw gqlError(`Despesa '${id}' não encontrada.`, 'NOT_FOUND', 404)
      }
      logMutation('deleteExpense', `exp:${id} → removed`)
      return ok()
    },

    // ── Expenses — OCR simulation ─────────────────────────────────
    ocrReceipt: (_, __, context) => {
      requireAuth(context)
      const samples = [
        { merchant: 'IKD Restaurante',   amount: 42.90, category: 'Refeição',   confidence: 0.97 },
        { merchant: 'Uber',              amount: 18.70, category: 'Transporte',  confidence: 0.94 },
        { merchant: 'Drogaria Raia',     amount: 64.50, category: 'Saúde',       confidence: 0.91 },
        { merchant: 'Pão de Açúcar',     amount: 89.90, category: 'Alimentação', confidence: 0.88 },
        { merchant: 'Smart Fit',         amount: 99.90, category: 'Saúde',       confidence: 0.93 },
        { merchant: 'Livraria Cultura',  amount: 54.00, category: 'Educação',    confidence: 0.89 },
        { merchant: 'Posto Ipiranga',    amount: 120.00, category: 'Transporte', confidence: 0.85 },
      ]
      const pick = samples[Math.floor(Math.random() * samples.length)]
      return {
        success: true,
        merchant: pick.merchant,
        amount: pick.amount,
        date: new Date().toISOString().slice(0, 10),
        category: pick.category,
        confidence: pick.confidence,
      }
    },

    // ── Advances ──────────────────────────────────────────────────
    createAdvance: (_, { input }, context) => {
      requireAuth(context)
      if (!input.amount || input.amount <= 0) {
        throw gqlError('Valor deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      if (!input.reason) {
        throw gqlError('Motivo é obrigatório.', 'BAD_REQUEST', 400)
      }
      const a = {
        id: nextId('adv'),
        amount: input.amount,
        reason: input.reason,
        status: 'pendente',
        requestedAt: new Date().toISOString(),
        resolvedAt: null,
        approverNote: null,
      }
      addAdvance(a)
      logMutation('createAdvance', `adv:${a.id} | R$${a.amount} reason:${a.reason}`)
      return a
    },

    // ── Reports ───────────────────────────────────────────────────
    createExpenseReport: (_, { input }, context) => {
      requireAuth(context)
      if (!input.title) {
        throw gqlError('Título é obrigatório.', 'BAD_REQUEST', 400)
      }
      if (!input.expenseIds || input.expenseIds.length === 0) {
        throw gqlError('Pelo menos uma despesa deve ser incluída no relatório.', 'BAD_REQUEST', 400)
      }
      // Calculate total from expense IDs
      const expenses = getExpenses()
      const matchedExpenses = expenses.filter(e => input.expenseIds.includes(e.id))
      const totalAmount = matchedExpenses.reduce((sum, e) => sum + e.amount, 0)

      const r = {
        id: nextId('rep'),
        title: input.title,
        period: input.period,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        expenseCount: input.expenseIds.length,
        status: 'rascunho',
        createdAt: new Date().toISOString(),
        submittedAt: null,
        expenseIds: input.expenseIds,
      }
      addReport(r)
      logMutation('createExpenseReport', `rep:${r.id} | ${r.title} R$${r.totalAmount} (${r.expenseCount} expenses)`)
      return r
    },

    submitExpenseReport: (_, { id }, context) => {
      requireAuth(context)
      const submitted = submitReport(id)
      if (!submitted) {
        throw gqlError(`Relatório '${id}' não encontrado.`, 'NOT_FOUND', 404)
      }
      logMutation('submitExpenseReport', `rep:${id} → submetido`)
      return ok()
    },

    // ── Vouchers ──────────────────────────────────────────────────
    buyVoucher: (_, { input }, context) => {
      const userId = requireAuth(context)
      if (!input.voucherId) {
        throw gqlError('voucherId é obrigatório.', 'BAD_REQUEST', 400)
      }
      if (!input.walletId) {
        throw gqlError('walletId é obrigatório.', 'BAD_REQUEST', 400)
      }
      const purchased = buyVoucher(input.voucherId, input.walletId, userId)
      if (!purchased) {
        throw gqlError(`Voucher '${input.voucherId}' não encontrado ou indisponível.`, 'NOT_FOUND', 404)
      }
      logMutation('buyVoucher', `user:${userId} | voucher:${input.voucherId} wallet:${input.walletId} → code:${purchased.code}`)
      return purchased
    },

    analyseVoucher: (_, { code }, context) => {
      requireAuth(context)
      const vouchers = getAvailableVouchers()
      return vouchers[0] ? { ...vouchers[0], code } : null
    },

    // ── Geofencing ────────────────────────────────────────────────
    addGeofenceZone: (_, { input }, context) => {
      requireAuth(context)
      if (!input.name) {
        throw gqlError('Nome da zona é obrigatório.', 'BAD_REQUEST', 400)
      }
      if (input.latitude == null || input.longitude == null) {
        throw gqlError('Latitude e longitude são obrigatórias.', 'BAD_REQUEST', 400)
      }
      if (!input.radiusMeters || input.radiusMeters <= 0) {
        throw gqlError('Raio deve ser maior que zero.', 'BAD_REQUEST', 400)
      }
      const zone = {
        id: input.id,
        name: input.name,
        description: input.description ?? null,
        latitude: input.latitude,
        longitude: input.longitude,
        radiusMeters: input.radiusMeters,
        isActive: input.isActive ?? true,
        partnerId: input.partnerId ?? null,
        type: input.type ?? 'custom',
      }
      addGeofenceZone(zone)
      logMutation('addGeofenceZone', `zone:${zone.id} | ${zone.name} (${zone.latitude},${zone.longitude}) r=${zone.radiusMeters}m`)
      return { id: zone.id }
    },

    removeGeofenceZone: (_, { id }, context) => {
      requireAuth(context)
      const removed = removeGeofenceZone(id)
      if (!removed) {
        throw gqlError(`Zona '${id}' não encontrada.`, 'NOT_FOUND', 404)
      }
      logMutation('removeGeofenceZone', `zone:${id} → removed`)
      return removed
    },

    toggleGeofenceZone: (_, { id, active }, context) => {
      requireAuth(context)
      const result = toggleGeofenceZone(id, active)
      if (result === null) {
        throw gqlError(`Zona '${id}' não encontrada.`, 'NOT_FOUND', 404)
      }
      logMutation('toggleGeofenceZone', `zone:${id} → isActive:${result}`)
      return result
    },

    // ── Flow Tokens ─────────────────────────────────────────────
    startFlow: (_, { flowType }, context) => {
      requireAuth(context)
      _flowTokenCounter++
      const token = `flow_${flowType}_${Date.now()}_${_flowTokenCounter}`
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
      _flowTokens.set(token, { flowType, expiresAt, createdAt: new Date().toISOString() })
      logMutation('startFlow', `type:${flowType} token:${token.slice(0, 30)}...`)
      return { token, flowType, expiresAt }
    },

    validateFlowToken: (_, { token }, context) => {
      requireAuth(context)
      const entry = _flowTokens.get(token)
      if (!entry) return false
      if (new Date() > new Date(entry.expiresAt)) {
        _flowTokens.delete(token)
        return false
      }
      return true
    },

    // ── External Benefits ─────────────────────────────────────────
    activateBenefit: (_, { id }, context) => {
      requireAuth(context)
      activateBenefit(id)
      logMutation('activateBenefit', `benefit:${id} → ativo:true`)
      return ok()
    },

    // ── HR ──────────────────────────────────────────────────────
    clockIn: (_, { latitude, longitude }, context) => {
      const userId = requireAuth(context)
      const entry = {
        id: nextId('clk'),
        employeeId: userId,
        timestamp: new Date().toISOString(),
        type: 'entry',
        reason: null,
        latitude: latitude ?? -23.5630,
        longitude: longitude ?? -46.6543,
        approved: true,
      }
      addClockEntry(entry)
      logMutation('clockIn', `user:${userId} | ${entry.timestamp}`)
      return entry
    },

    clockOut: (_, __, context) => {
      const userId = requireAuth(context)
      const entry = {
        id: nextId('clk'),
        employeeId: userId,
        timestamp: new Date().toISOString(),
        type: 'exit',
        reason: null,
        latitude: -23.5630,
        longitude: -46.6543,
        approved: true,
      }
      addClockEntry(entry)
      logMutation('clockOut', `user:${userId} | ${entry.timestamp}`)
      return entry
    },

    manualClockEntry: (_, { date, timeIn, timeOut, reason }, context) => {
      const userId = requireAuth(context)
      if (!date) {
        throw gqlError('Data é obrigatória para registro manual.', 'BAD_REQUEST', 400)
      }
      if (!timeIn || !timeOut) {
        throw gqlError('Horários de entrada e saída são obrigatórios para registro manual.', 'BAD_REQUEST', 400)
      }
      if (!reason) {
        throw gqlError('Motivo é obrigatório para registro manual.', 'BAD_REQUEST', 400)
      }
      const entry = {
        id: nextId('clk'),
        employeeId: userId,
        timestamp: `${date}T${timeIn}:00.000Z`,
        type: 'manual',
        reason,
        latitude: null,
        longitude: null,
        approved: false,
      }
      addClockEntry(entry)
      logMutation('manualClockEntry', `user:${userId} | ${date} ${timeIn}-${timeOut} reason:${reason}`)
      return entry
    },

    scheduleVacation: (_, { startDate, endDate }, context) => {
      const userId = requireAuth(context)
      if (!startDate || !endDate) {
        throw gqlError('Datas de início e fim são obrigatórias.', 'BAD_REQUEST', 400)
      }
      const start = new Date(startDate)
      const end = new Date(endDate)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      if (start < now) {
        throw gqlError('Data de início não pode ser no passado.', 'BAD_REQUEST', 400)
      }
      if (end < start) {
        throw gqlError('Data de fim deve ser posterior à data de início.', 'BAD_REQUEST', 400)
      }
      // Check for overlapping vacation periods
      const existingVacations = getVacationHistory()
      const overlapping = existingVacations.find(v => {
        const vStart = new Date(v.startDate)
        const vEnd = new Date(v.endDate)
        return start <= vEnd && end >= vStart
      })
      if (overlapping) {
        throw gqlError(
          `Período de férias sobrepõe um período existente (${overlapping.startDate} a ${overlapping.endDate}).`,
          'CONFLICT', 409
        )
      }
      const daysCount = Math.ceil((end - start) / 86400000) + 1
      const period = {
        id: nextId('vac'),
        startDate,
        endDate,
        daysCount,
        status: 'pending',
        approver: null,
      }
      addVacationPeriod(period)
      logMutation('scheduleVacation', `user:${userId} | ${startDate} → ${endDate} (${daysCount}d)`)
      return period
    },

    // ── Credit ─────────────────────────────────────────────────
    createCreditConsent: (_, { simulationId }, context) => {
      requireAuth(context)
      if (!simulationId) {
        throw gqlError('simulationId é obrigatório.', 'BAD_REQUEST', 400)
      }
      logMutation('createCreditConsent', `sim:${simulationId} → consent granted`)
      return true
    },

    executeCreditOperation: (_, { consentId }, context) => {
      requireAuth(context)
      if (!consentId) {
        throw gqlError('consentId é obrigatório.', 'BAD_REQUEST', 400)
      }
      logMutation('executeCreditOperation', `consent:${consentId} → executed`)
      return true
    },

    // ── Travel ─────────────────────────────────────────────────
    createTravel: (_, { destination, startDate, endDate, purpose }, context) => {
      const userId = requireAuth(context)
      if (!destination) {
        throw gqlError('Destino é obrigatório.', 'BAD_REQUEST', 400)
      }
      if (!startDate || !endDate) {
        throw gqlError('Datas de início e fim são obrigatórias.', 'BAD_REQUEST', 400)
      }
      const start = new Date(startDate)
      const end = new Date(endDate)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      if (start < now) {
        throw gqlError('Data de início da viagem não pode ser no passado.', 'BAD_REQUEST', 400)
      }
      if (end < start) {
        throw gqlError('Data de fim deve ser posterior à data de início.', 'BAD_REQUEST', 400)
      }
      const travel = {
        id: nextId('trv'),
        destination,
        startDate,
        endDate,
        purpose,
        status: 'draft',
        totalBudget: 0.0,
      }
      addTravel(travel)
      logMutation('createTravel', `user:${userId} | ${destination} ${startDate}→${endDate}`)
      return travel
    },

    submitTravel: (_, { id }, context) => {
      const userId = requireAuth(context)
      const travel = getTravelById(id)
      if (!travel) {
        throw gqlError(`Viagem '${id}' não encontrada.`, 'NOT_FOUND', 404)
      }
      const updated = updateTravelStatus(id, 'pending')
      logMutation('submitTravel', `user:${userId} | trv:${id} → pending`)
      return updated
    },

    cancelTravel: (_, { id }, context) => {
      const userId = requireAuth(context)
      const travel = getTravelById(id)
      if (!travel) {
        throw gqlError(`Viagem '${id}' não encontrada.`, 'NOT_FOUND', 404)
      }
      const removed = removeTravel(id)
      logMutation('cancelTravel', `user:${userId} | trv:${id} → cancelled`)
      return removed
    },

    // ── Missing Mutation resolvers ──────────────────────────────
    discardClockEntry: (_, { id }, context) => {
      requireAuth(context)
      const result = discardClockEntry(id)
      if (!result) throw gqlError(`Registro de ponto '${id}' não encontrado.`, 'NOT_FOUND', 404)
      logMutation('discardClockEntry', `clk:${id} → discarded`)
      return result
    },

    restoreClockEntry: (_, { id }, context) => {
      requireAuth(context)
      const result = restoreClockEntry(id)
      if (!result) throw gqlError(`Registro de ponto '${id}' não encontrado.`, 'NOT_FOUND', 404)
      logMutation('restoreClockEntry', `clk:${id} → restored`)
      return result
    },

    uploadCreditFile: (_, { loanId, fileType, fileName }, context) => {
      requireAuth(context)
      if (!loanId) throw gqlError('loanId é obrigatório.', 'BAD_REQUEST', 400)
      if (!fileType) throw gqlError('fileType é obrigatório.', 'BAD_REQUEST', 400)
      if (!fileName) throw gqlError('fileName é obrigatório.', 'BAD_REQUEST', 400)
      logMutation('uploadCreditFile', `loan:${loanId} | ${fileType}: ${fileName}`)
      return {
        id: `file-${Date.now()}`,
        type: fileType,
        label: fileName,
        description: `Uploaded ${fileName}`,
        required: true,
        accepted: false,
      }
    },

    addTravelExpense: (_, { travelId, type, description, amount, date }, context) => {
      requireAuth(context)
      if (!travelId) throw gqlError('travelId é obrigatório.', 'BAD_REQUEST', 400)
      if (!amount || amount <= 0) throw gqlError('Valor deve ser maior que zero.', 'BAD_REQUEST', 400)
      const travel = getTravelById(travelId)
      if (!travel) throw gqlError(`Viagem '${travelId}' não encontrada.`, 'NOT_FOUND', 404)
      const expense = addTravelExpense(travelId, { type, description, amount, date })
      storeTravelExpense(expense)
      logMutation('addTravelExpense', `trv:${travelId} | ${type} R$${amount}`)
      return expense
    },
  },
}

// ── Additional Query resolvers (appended to main resolvers) ─────────
// These are merged into the Query object at server startup.
export const additionalResolvers = {
  Query: {
    banks: () => getBanks(),
    mobileCarriers: () => getMobileCarriers(),
    marketplaceOffers: () => getMarketplaceOffers(),
    savingsGoals: () => getSavingsGoals(),
    transportCards: () => getTransportCards(),

    achievements: () => [
      { id: 'ach-001', name: 'Primeiro PIX', icon: 'pix', description: 'Realizou sua primeira transferencia PIX', unlocked: true, unlockedAt: '2026-03-15T10:00:00Z' },
      { id: 'ach-002', name: 'Explorador', icon: 'explore', description: 'Visitou 5 telas diferentes do app', unlocked: true, unlockedAt: '2026-03-16T14:00:00Z' },
      { id: 'ach-003', name: 'Economista', icon: 'savings', description: 'Criou sua primeira meta de economia', unlocked: true, unlockedAt: '2026-03-18T09:00:00Z' },
      { id: 'ach-004', name: 'Social', icon: 'share', description: 'Indicou um amigo para o Origami', unlocked: true, unlockedAt: '2026-03-20T11:00:00Z' },
      { id: 'ach-005', name: 'Organizador', icon: 'folder', description: 'Registrou sua primeira despesa', unlocked: false, unlockedAt: null },
      { id: 'ach-006', name: 'Viajante', icon: 'flight', description: 'Criou seu primeiro pedido de viagem', unlocked: false, unlockedAt: null },
      { id: 'ach-007', name: 'Leitor', icon: 'book', description: 'Leu 3 artigos na Central de Ajuda', unlocked: false, unlockedAt: null },
      { id: 'ach-008', name: 'Fiel', icon: 'loyalty', description: 'Usou o app por 7 dias seguidos', unlocked: false, unlockedAt: null },
    ],

    referrals: () => [
      { id: 'ref-001', name: 'Maria Santos', date: '2026-03-15', status: 'creditado', reward: 50.00 },
      { id: 'ref-002', name: 'João Pedro', date: '2026-03-20', status: 'aguardando', reward: 0 },
      { id: 'ref-003', name: 'Ana Carolina', date: '2026-03-22', status: 'pendente', reward: 0 },
      { id: 'ref-004', name: 'Carlos Eduardo', date: '2026-03-23', status: 'creditado', reward: 50.00 },
      { id: 'ref-005', name: 'Fernanda Rocha', date: '2026-03-24', status: 'pendente', reward: 0 },
    ],
  },
}
