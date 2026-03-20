import { makeToken, getUserIdFromRequest } from './auth.js'
import {
  nextId, logMutation,
  // Getters
  findUserByCpf, findUserById,
  getWallets, findWallet,
  getCards, getCardById, getTransactions,
  getNotifications, getNotifPrefs,
  getPartners, getPartnerById, getFavoritePartners, getNearbyPartners,
  getApprovals, getDisputes, getReimbursements,
  getBalanceRequests, getExpenses, getAdvances,
  getReports, getAvailableVouchers, getMyVouchers,
  getGeofenceZones, getDigitalWalletCards,
  getExternalBenefits, getRewardsSummary,
  getSensitiveData, getScheduledDeposits, getNextDeposits,
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
  updateUserPassword, resetFailedAttempts,
} from './state.js'

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

// ─── Helper: resultado de sucesso ────────────────────────────────────────────
const ok = (extra = {}) => ({ success: true, message: null, ...extra })

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
      }
    },

    sessions: (_, __, context) => getStaticSessionsList(uid(context)),
    securityActivity: (_, __, context) => getSecurityActivityList(uid(context)),

    // ── Wallet ────────────────────────────────────────────────────
    wallets: (_, __, context) => getWallets(uid(context)),

    transactions: (_, { walletId, dateFrom, dateTo, categoria, direcao, limit, offset } = {}, context) => {
      let txs = getTransactions(uid(context))
      if (walletId)   txs = txs.filter(t => t.walletId === walletId)
      if (dateFrom)   txs = txs.filter(t => t.data >= dateFrom)
      if (dateTo)     txs = txs.filter(t => t.data <= dateTo + 'T23:59:59')
      if (categoria)  txs = txs.filter(t => t.categoria === categoria)
      if (direcao)    txs = txs.filter(t => t.direcao === direcao)
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
      const deposits = getNextDeposits(uid(context))
      if (deposits.length > 0) {
        return walletId ? deposits.filter(d => d.walletId === walletId) : deposits
      }
      // Fallback for users without seed deposits
      const wallets = getWallets(uid(context))
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

    cardDelivery: (_, { id: cardId }) => {
      const delivery = getCardDelivery(cardId)
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
  },

  // ══════════════════════════════════════════════════════════════════
  //  MUTATIONS — all modify state
  // ══════════════════════════════════════════════════════════════════
  Mutation: {

    // ── Auth ──────────────────────────────────────────────────────
    login: (_, { input }) => {
      const { cpf, password } = input
      const user = findUserByCpf(cpf)
      if (!user) return null
      if (user.bloqueioDefinitivo) return null
      if (user.senha === null) {
        trackLogin(user.id)
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
      if (user.senha !== password) return null
      trackLogin(user.id)
      resetFailedAttempts(user.id)
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
      const userId = uid(context)
      trackLogout(userId)
      logMutation('logout', `user:${userId}`)
      return ok()
    },

    forgotPassword: (_, { cpf }) => {
      const user = findUserByCpf(cpf)
      return user ? ok() : { success: false, message: 'CPF não encontrado' }
    },

    verifyOtp: (_, { otp }) => {
      if (otp === '0000') return { success: false, message: 'Código inválido', resetTicket: null }
      return { success: true, message: null, resetTicket: `mock-reset-ticket-${Date.now()}` }
    },

    resetPassword: (_, { input: { resetTicket, newPassword } }) => {
      if (resetTicket.length > 0 && newPassword.length >= 8) {
        logMutation('resetPassword', `ticket:${resetTicket.slice(0, 20)}...`)
        return ok()
      }
      return { success: false, message: 'Dados inválidos' }
    },

    updatePassword: (_, { input }) => {
      if (input) {
        updateUserPassword(input.cpf, input.newPassword)
        logMutation('updatePassword', `cpf:${input.cpf}`)
      }
      return ok()
    },

    validateCode: (_, { code }) =>
      code === VALID_OTP_CODE ? ok() : { success: false, message: 'Código inválido' },

    validateDeviceToken: (_, { token }) => ({
      success: token === VALID_DEVICE_TOKEN,
      message: token === VALID_DEVICE_TOKEN ? null : 'Token inválido',
      deviceTrusted: token === VALID_DEVICE_TOKEN,
    }),

    terminateSession: () => ok(),
    setTransactionPin: () => ok(),
    validateTransactionPin: (_, { pin }) =>
      pin === VALID_TX_PIN ? ok() : { success: false, message: 'PIN incorreto' },
    toggle2FA: () => ok(),
    verify2FACode: (_, { code }) =>
      code === VALID_2FA_CODE ? ok() : { success: false, message: 'Código 2FA inválido' },
    requestDataDeletion: () => ({ success: true, message: null, protocol: `DEL-${Date.now()}` }),
    validatePhone: (_, { phone }) =>
      phone.replace(/\D/g, '').length >= 10 ? ok() : { success: false, message: 'Telefone inválido' },
    recoverTransactionPin: () => ok(),
    updateTransactionPin: (_, { recoveryCode, newPin }) =>
      recoveryCode === VALID_OTP_CODE && newPin.length >= 4 ? ok() : { success: false, message: 'Dados inválidos' },

    // ── Wallet ────────────────────────────────────────────────────
    pixTransfer: (_, { input }, context) => {
      const userId = uid(context)
      const wallet = deductWallet(userId, input.walletId, input.amount)
      const tx = makeTx('pix', `PIX para ${input.chavePix}`, input.amount, input.walletId, 'PIX')
      addTransaction(userId, tx)
      logMutation('pixTransfer', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return { ...tx, direcao: 'debito', estabelecimento: tx.merchant, walletTipo: null, nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null, enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null, mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null }
    },

    processQrPayment: (_, { input }, context) => {
      const userId = uid(context)
      const wallet = deductWallet(userId, input.walletId, input.amount)
      const tx = makeTx('qr', 'Pagamento QR Code', input.amount, input.walletId, 'QR Code')
      addTransaction(userId, tx)
      logMutation('processQrPayment', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return { ...tx, direcao: 'debito', estabelecimento: tx.merchant, walletTipo: null, nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null, enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null, mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null }
    },

    payBoleto: (_, { input }, context) => {
      const userId = uid(context)
      const wallet = deductWallet(userId, input.walletId, input.amount)
      const tx = makeTx('bol', 'Pagamento de Boleto', input.amount, input.walletId, 'Boleto')
      addTransaction(userId, tx)
      logMutation('payBoleto', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return { ...tx, direcao: 'debito', estabelecimento: tx.merchant, walletTipo: null, nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null, enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null, mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null }
    },

    mobileRecharge: (_, { input }, context) => {
      const userId = uid(context)
      const wallet = deductWallet(userId, input.walletId, input.amount)
      const tx = makeTx('rec', `Recarga ${input.phone}`, input.amount, input.walletId, 'Recarga')
      addTransaction(userId, tx)
      logMutation('mobileRecharge', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return { ...tx, direcao: 'debito', estabelecimento: tx.merchant, walletTipo: null, nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null, enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null, mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null }
    },

    reallocateBenefit: (_, { input }, context) => {
      const userId = uid(context)
      const from = deductWallet(userId, input.fromWalletId, input.amount)
      const to = creditWallet(userId, input.toWalletId, input.amount)
      logMutation('reallocateBenefit', `user:${userId} | ${input.fromWalletId} -R$${input.amount} → ${input.toWalletId} +R$${input.amount} | from:R$${from?.saldo ?? '?'} to:R$${to?.saldo ?? '?'}`)
      return !!(from && to)
    },

    scheduleDeposit: (_, { input }, context) => {
      const userId = uid(context)
      addScheduledDeposit(userId, input.walletId, input.amount, input.scheduledDate)
      logMutation('scheduleDeposit', `user:${userId} | wallet:${input.walletId} R$${input.amount} on ${input.scheduledDate}`)
      return true
    },

    updateWalletLimit: (_, { input }, context) => {
      const userId = uid(context)
      const wallet = updateWalletLimit(userId, input.walletId, input.newLimit)
      logMutation('updateWalletLimit', `user:${userId} | wallet:${input.walletId} → limit:R$${input.newLimit}`)
      return wallet ? { ...wallet } : null
    },

    reclassifyTransaction: (_, { input }, context) => {
      const userId = uid(context)
      const ok = reclassifyTransaction(userId, input.transactionId, input.newCategory)
      logMutation('reclassifyTransaction', `user:${userId} | tx:${input.transactionId} → ${input.newCategory}`)
      return ok
    },

    cashOut: (_, { input }, context) => {
      const userId = uid(context)
      const wallet = deductWallet(userId, input.walletId, input.amount)
      const tx = makeTx('cashout', 'Saque bancário', input.amount, input.walletId, 'Saque')
      addTransaction(userId, tx)
      logMutation('cashOut', `user:${userId} | wallet:${input.walletId} -R$${input.amount} → R$${wallet?.saldo ?? '?'}`)
      return { ...tx, direcao: 'debito', estabelecimento: tx.merchant, walletTipo: null, nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null, enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null, mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null }
    },

    pixCashOutPreview: (_, { input }) => ({
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
    }),

    executePixCashOut: (_, { input }, context) => {
      const userId = uid(context)
      const totalDebited = parseFloat((input.amount * 1.015).toFixed(2))
      const wallet = deductWallet(userId, input.walletId, totalDebited)
      const tx = makeTx('cashout', `PIX Cash Out para ${input.chavePix}`, input.amount, input.walletId, 'PIX Cash Out')
      addTransaction(userId, tx)
      logMutation('executePixCashOut', `user:${userId} | wallet:${input.walletId} -R$${totalDebited} (fee incl.) → R$${wallet?.saldo ?? '?'}`)
      return { ...tx, direcao: 'debito', estabelecimento: tx.merchant, walletTipo: null, nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null, enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null, mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null }
    },

    statementExport: (_, { input }) => ({
      url: `https://mock.origami.com.br/statements/extrato.${input.format.toLowerCase()}`,
      format: input.format,
    }),

    // ── Cards ─────────────────────────────────────────────────────
    blockCard: (_, { id: cardId }, context) => {
      const userId = uid(context)
      const card = setCardStatus(userId, cardId, 'bloqueado')
      logMutation('blockCard', `user:${userId} | card:${cardId} → bloqueado`)
      const { pin, ...safe } = card || getCardById(userId, cardId)
      return { ...safe, status: 'bloqueado' }
    },

    unblockCard: (_, { id: cardId }, context) => {
      const userId = uid(context)
      const card = setCardStatus(userId, cardId, 'ativo')
      logMutation('unblockCard', `user:${userId} | card:${cardId} → ativo`)
      const { pin, ...safe } = card || getCardById(userId, cardId)
      return { ...safe, status: 'ativo' }
    },

    createVirtualCard: (_, __, context) => {
      const userId = uid(context)
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
      const userId = uid(context)
      const card = setCardStatus(userId, cardId, 'ativo')
      logMutation('activateCard', `user:${userId} | card:${cardId} → ativo`)
      const { pin, ...safe } = card || getCardById(userId, cardId)
      return { ...safe, status: 'ativo' }
    },

    validateCardPin: (_, { id, pin }, context) => {
      const userId = uid(context)
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
      if (['0000', '1234', '4321'].includes(newPin)) {
        return { success: false, message: 'PIN inválido. Escolha outro.' }
      }
      const userId = uid(context)
      setCardPin(userId, id, newPin)
      logMutation('changeCardPin', `user:${userId} | card:${id} → PIN changed`)
      return ok()
    },

    requestCardReplacement: (_, { id, reason }, context) => {
      const userId = uid(context)
      addCardReplacement(id, reason)
      setCardStatus(userId, id, 'substituicao_solicitada')
      const protocol = `REP-${Date.now().toString().slice(-6)}`
      logMutation('requestCardReplacement', `user:${userId} | card:${id} reason:${reason} protocol:${protocol}`)
      return { success: true, message: protocol }
    },

    toggleInternationalMode: () => true,

    // ── Notifications ─────────────────────────────────────────────
    markNotificationRead: (_, { id }, context) => {
      const userId = uid(context)
      markNotifRead(userId, id)
      logMutation('markNotificationRead', `user:${userId} | notif:${id} → lida=true`)
      return ok()
    },

    markAllNotificationsRead: (_, __, context) => {
      const userId = uid(context)
      markAllNotifsRead(userId)
      logMutation('markAllNotificationsRead', `user:${userId} | all → lida=true`)
      return ok()
    },

    updateNotificationPreferences: (_, { input }, context) => {
      const userId = uid(context)
      setNotifPrefs(userId, input)
      logMutation('updateNotificationPreferences', `user:${userId} | push:${input.pushEnabled} email:${input.emailEnabled} sms:${input.smsEnabled}`)
      return input
    },

    // ── Partners ──────────────────────────────────────────────────
    toggleFavoritePartner: (_, { partnerId: id }, context) => {
      const userId = uid(context)
      const result = toggleFavorite(userId, id)
      logMutation('toggleFavoritePartner', `user:${userId} | partner:${id} → ${result ? 'added' : 'removed'}`)
      return result
    },

    // ── Disputes ──────────────────────────────────────────────────
    submitDispute: (_, { transactionId, description, amount, merchantName }) => {
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
    submitReimbursement: (_, { category, amount, date, description, receiptUrl }) => {
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
    createBalanceRequest: (_, { input }) => {
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

    updateBalanceRequest: (_, { input }) => {
      const req = updateBalanceRequestStatus(input.requestId, input.status, input.rejectionReason)
      logMutation('updateBalanceRequest', `br:${input.requestId} → ${input.status}${input.rejectionReason ? ' reason:' + input.rejectionReason : ''}`)
      return req
    },

    // ── Digital Wallet ────────────────────────────────────────────
    addToGooglePay: (_, { cardId }) => {
      const ok = addToDigitalWallet(cardId, 'google_pay')
      logMutation('addToGooglePay', `card:${cardId} → ${ok ? 'provisioned' : 'failed'}`)
      return ok
    },

    addToSamsungPay: (_, { cardId }) => {
      const ok = addToDigitalWallet(cardId, 'samsung_pay')
      logMutation('addToSamsungPay', `card:${cardId} → ${ok ? 'provisioned' : 'failed'}`)
      return ok
    },

    removeFromDigitalWallet: (_, { cardId, provider }) => {
      const ok = removeFromDigitalWallet(cardId, provider)
      logMutation('removeFromDigitalWallet', `card:${cardId} provider:${provider} → ${ok ? 'removed' : 'not found'}`)
      return ok
    },

    // ── KYC ───────────────────────────────────────────────────────
    validateCpfBigDataCorp: () => true,

    submitKycDocuments: () => ({
      id: nextId('kyc-doc'),
      status: 'aguardando_analise',
      cpfValid: true,
      documentValid: null,
      certifaceScore: null,
      rejectionReason: null,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
    }),

    submitCertifaceSelfie: () => ({
      id: nextId('kyc-selfie'),
      status: 'aprovada',
      cpfValid: true,
      documentValid: true,
      certifaceScore: 0.98,
      rejectionReason: null,
      submittedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
    }),

    // ── Approvals ─────────────────────────────────────────────────
    approveAction: (_, { id }) => {
      const item = approveAction(id)
      logMutation('approveAction', `appr:${id} → aprovada at ${item?.decidedAt ?? 'n/a'}`)
      return item ?? getApprovals()[0]
    },

    rejectAction: (_, { id, reason }) => {
      const item = rejectAction(id, reason)
      logMutation('rejectAction', `appr:${id} → reprovado reason:${reason}`)
      return item ?? getApprovals()[0]
    },

    // ── Feedback ──────────────────────────────────────────────────
    submitFeedback: () => ok(),

    // ── Rewards ───────────────────────────────────────────────────
    redeemReward: (_, { rewardId } = {}, context) => {
      const userId = uid(context)
      const newPoints = redeemReward(userId, rewardId)
      logMutation('redeemReward', `user:${userId} | reward:${rewardId} → pts:${newPoints}`)
      return ok()
    },

    // ── Expenses ──────────────────────────────────────────────────
    createExpense: (_, { input }) => {
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

    deleteExpense: (_, { id }) => {
      const removed = deleteExpense(id)
      logMutation('deleteExpense', `exp:${id} → ${removed ? 'removed' : 'not found'}`)
      return removed ? ok() : { success: false, message: 'Despesa não encontrada' }
    },

    // ── Expenses — OCR simulation ─────────────────────────────────
    ocrReceipt: () => {
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
    createAdvance: (_, { input }) => {
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
    createExpenseReport: (_, { input }) => {
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

    submitExpenseReport: (_, { id }) => {
      const submitted = submitReport(id)
      logMutation('submitExpenseReport', `rep:${id} → ${submitted ? 'submetido' : 'not found'}`)
      return submitted ? ok() : { success: false, message: 'Relatório não encontrado' }
    },

    // ── Vouchers ──────────────────────────────────────────────────
    buyVoucher: (_, { input }, context) => {
      const userId = uid(context)
      const purchased = buyVoucher(input.voucherId, input.walletId, userId)
      if (purchased) {
        logMutation('buyVoucher', `user:${userId} | voucher:${input.voucherId} wallet:${input.walletId} → code:${purchased.code}`)
      }
      return purchased ?? getAvailableVouchers()[0]
    },

    analyseVoucher: (_, { code }) => {
      const vouchers = getAvailableVouchers()
      return vouchers[0] ? { ...vouchers[0], code } : null
    },

    // ── Geofencing ────────────────────────────────────────────────
    addGeofenceZone: (_, { input }) => {
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

    removeGeofenceZone: (_, { id }) => {
      const removed = removeGeofenceZone(id)
      logMutation('removeGeofenceZone', `zone:${id} → ${removed ? 'removed' : 'not found'}`)
      return removed
    },

    toggleGeofenceZone: (_, { id, active }) => {
      const result = toggleGeofenceZone(id, active)
      logMutation('toggleGeofenceZone', `zone:${id} → isActive:${result}`)
      return result ?? false
    },

    // ── Flow Tokens ─────────────────────────────────────────────
    startFlow: (_, { flowType }) => {
      _flowTokenCounter++
      const token = `flow_${flowType}_${Date.now()}_${_flowTokenCounter}`
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
      _flowTokens.set(token, { flowType, expiresAt, createdAt: new Date().toISOString() })
      logMutation('startFlow', `type:${flowType} token:${token.slice(0, 30)}...`)
      return { token, flowType, expiresAt }
    },

    validateFlowToken: (_, { token }) => {
      const entry = _flowTokens.get(token)
      if (!entry) return false
      if (new Date() > new Date(entry.expiresAt)) {
        _flowTokens.delete(token)
        return false
      }
      return true
    },

    // ── External Benefits ─────────────────────────────────────────
    activateBenefit: (_, { id }) => {
      activateBenefit(id)
      logMutation('activateBenefit', `benefit:${id} → ativo:true`)
      return ok()
    },
  },
}
