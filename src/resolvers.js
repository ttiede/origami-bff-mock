import { makeToken, getUserIdFromRequest } from './auth.js'
import { findUserByCpf, findUserById } from './data/users.js'
import { getWallets } from './data/wallets.js'
import { getCards, getCardById, SENSITIVE_DATA } from './data/cards.js'
import { getTransactions } from './data/transactions.js'
import { getNotifications } from './data/notifications.js'
import { getPartners, getPartnerById, getFavoritePartners, ALL_PARTNERS } from './data/partners.js'
import {
  BANNERS, DISPUTES, REIMBURSEMENTS, BALANCE_REQUESTS,
  APPROVALS, EXTERNAL_BENEFITS, REWARDS_SUMMARY,
  FAQS, EXPENSES, ADVANCES, REPORTS, AVAILABLE_VOUCHERS, MY_VOUCHERS,
  GEOFENCE_ZONES, DIGITAL_WALLET_CARDS,
  getStaticSessions, getSecurityActivity,
} from './data/static.js'

// ─── In-memory state (resets on server restart) ──────────────────────────────
const _state = {
  favorites:            new Map(), // Map<userId, Set<partnerId>>
  cardStatus:           new Map(), // Map<cardId, string>
  approvalOverrides:    new Map(), // Map<approvalId, object>
  geofenceActive:       new Map(), // Map<zoneId, boolean>
  notifPrefs:           new Map(), // Map<userId, object>
  benefitActive:        new Map(), // Map<benefitId, boolean>
  rewardOverrides:      new Map(), // Map<userId, {totalPoints, level}>
  purchasedVouchers:    new Set(), // Set<voucherId>
  sessionDisputes:      [],
  sessionReimbursements:[],
  sessionBalanceReqs:   [],
  sessionExpenses:      [],
  sessionAdvances:      [],
  sessionReports:       [],
}

// Tokens OTP / device válidos (espelho do mock Flutter)
const VALID_OTP_CODE    = '1234'
const VALID_DEVICE_TOKEN = '2222'
const VALID_TX_PIN      = '1234'
const VALID_2FA_CODE    = '654321'

// ─── Helper: extrai userId do contexto da request ────────────────────────────
function uid(context) {
  return getUserIdFromRequest(context.request)
}

// ─── Helper: gera ID único para mutations ────────────────────────────────────
let _seq = 1
function nextId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${_seq++}`
}

// ─── Helper: monta Transaction mock ──────────────────────────────────────────
function makeTx(prefix, descricao, amount, walletId = 'w1') {
  return {
    id: nextId(prefix),
    descricao,
    valor: -amount,
    data: new Date().toISOString(),
    direcao: 'debito',
    status: 'aprovada',
    categoria: 'Pagamento',
    estabelecimento: descricao,
    walletId,
    walletTipo: 'flexivel',
    nsu: null,
    codigoAutorizacao: null,
    cnpjEstabelecimento: null,
    enderecoEstabelecimento: null,
    cartaoFinal: null,
    bandeira: null,
    mcc: null,
    mccDescricao: null,
    parcelas: null,
    valorParcela: null,
    nomePortador: null,
  }
}

// ─── Helper: resultado de sucesso ────────────────────────────────────────────
const ok = (extra = {}) => ({ success: true, message: null, ...extra })

export const resolvers = {
  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
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

    sessions: () => getStaticSessions(),
    securityActivity: () => getSecurityActivity(),

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
      const base = getCards(uid(context))
      return base.map(c => _state.cardStatus.has(c.id) ? { ...c, status: _state.cardStatus.get(c.id) } : c)
    },

    cardDelivery: (_, { id: cardId }) => ({
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
    }),

    revealCard: (_, { id: cardId }) => {
      const data = SENSITIVE_DATA[cardId]
      if (data) return data
      return {
        numeroCompleto: `4000 0000 0000 ${cardId.replace(/\D/g, '').padEnd(4, '0').slice(0, 4)}`,
        cvv: `${Math.floor(Math.random() * 900) + 100}`,
      }
    },

    // ── Notifications ─────────────────────────────────────────────
    notifications: (_, __, context) => getNotifications(uid(context)),

    notificationPreferences: (_, __, context) => {
      const userId = uid(context)
      return _state.notifPrefs.get(userId) ?? { pushEnabled: true, emailEnabled: true, smsEnabled: false }
    },

    // ── Partners ──────────────────────────────────────────────────
    partners: (_, args) => getPartners(args),
    nearbyPartners: () => getPartners({}),
    partner: (_, { id }) => getPartnerById(id),

    favoritePartners: (_, __, context) => {
      const userId = uid(context)
      const favSet = _state.favorites.get(userId) ?? new Set()
      if (favSet.size === 0) return getFavoritePartners()
      return ALL_PARTNERS.filter(p => favSet.has(p.id))
    },

    // ── Disputes ──────────────────────────────────────────────────
    disputes: () => [...DISPUTES, ..._state.sessionDisputes],

    // ── Reimbursements ────────────────────────────────────────────
    reimbursements: () => [...REIMBURSEMENTS, ..._state.sessionReimbursements],

    // ── Balance Requests ──────────────────────────────────────────
    balanceRequests: (_, { walletId } = {}) => {
      const all = [...BALANCE_REQUESTS, ..._state.sessionBalanceReqs]
      return walletId ? all.filter(b => b.walletId === walletId) : all
    },

    // ── KYC ───────────────────────────────────────────────────────
    kycStatus: () => ({
      id: 'kyc-001',
      status: 'aprovada',
      cpfValid: true,
      documentValid: true,
      certifaceScore: 0.98,
      rejectionReason: null,
      submittedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      reviewedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    }),

    // ── Approvals ─────────────────────────────────────────────────
    approvals: (_, { status } = {}) => {
      const all = APPROVALS.map(a => _state.approvalOverrides.has(a.id) ? { ...a, ..._state.approvalOverrides.get(a.id) } : a)
      return status ? all.filter(a => a.status === status) : all
    },

    approvalsPendingCount: () => {
      return APPROVALS.filter(a => {
        const ov = _state.approvalOverrides.get(a.id)
        return (ov ? ov.status : a.status) === 'pendente'
      }).length
    },

    // ── External Benefits ─────────────────────────────────────────
    externalBenefits: () => EXTERNAL_BENEFITS.map(b =>
      _state.benefitActive.has(b.id) ? { ...b, ativo: _state.benefitActive.get(b.id) } : b
    ),
    explainBenefit: (_, { id }) => EXTERNAL_BENEFITS.find(b => b.id === id) ?? null,

    // ── Rewards ───────────────────────────────────────────────────
    rewardsSummary: (_, __, context) => {
      const userId = uid(context)
      const ov = _state.rewardOverrides.get(userId)
      return ov ? { ...REWARDS_SUMMARY, ...ov } : REWARDS_SUMMARY
    },

    // ── Home ──────────────────────────────────────────────────────
    productBanners: () => BANNERS,

    // ── Digital Wallet ────────────────────────────────────────────
    digitalWalletCards: () => DIGITAL_WALLET_CARDS,

    // ── Help Center ───────────────────────────────────────────────
    faqs: () => FAQS,

    // ── Expenses ──────────────────────────────────────────────────
    expenses: () => [...EXPENSES, ..._state.sessionExpenses],

    // ── Advances ──────────────────────────────────────────────────
    advances: () => [...ADVANCES, ..._state.sessionAdvances],

    // ── Reports ───────────────────────────────────────────────────
    expenseReports: () => [...REPORTS, ..._state.sessionReports],

    // ── Vouchers ──────────────────────────────────────────────────
    availableVouchers: () => AVAILABLE_VOUCHERS,
    myVouchers: () => MY_VOUCHERS,

    // ── Geofencing ────────────────────────────────────────────────
    geofenceZones: () => GEOFENCE_ZONES.map(z =>
      _state.geofenceActive.has(z.id) ? { ...z, ativo: _state.geofenceActive.get(z.id) } : z
    ),
  },

  // ══════════════════════════════════════════════════════════════════
  //  MUTATIONS
  // ══════════════════════════════════════════════════════════════════
  Mutation: {

    // ── Auth ──────────────────────────────────────────────────────
    login: (_, { input }) => {
      const { cpf, password } = input
      const user = findUserByCpf(cpf)
      if (!user) return null
      if (user.bloqueioDefinitivo) return null
      if (user.senha === null) {
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

    logout: () => ok(),

    forgotPassword: (_, { cpf }) => {
      const user = findUserByCpf(cpf)
      return user ? ok() : { success: false, message: 'CPF não encontrado' }
    },

    verifyOtp: (_, { otp }) => {
      if (otp === '0000') return { success: false, message: 'Código inválido', resetTicket: null }
      return { success: true, message: null, resetTicket: `mock-reset-ticket-${Date.now()}` }
    },

    resetPassword: (_, { input: { resetTicket, newPassword } }) =>
      resetTicket.length > 0 && newPassword.length >= 8 ? ok() : { success: false, message: 'Dados inválidos' },

    updatePassword: () => ok(),

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
    pixTransfer: (_, { input }) =>
      makeTx('pix', `PIX para ${input.chavePix}`, input.amount, input.walletId),

    processQrPayment: (_, { input }) =>
      makeTx('qr', 'Pagamento QR Code', input.amount, input.walletId),

    payBoleto: (_, { input }) =>
      makeTx('bol', 'Pagamento de Boleto', input.amount, input.walletId),

    mobileRecharge: (_, { input }) =>
      makeTx('rec', `Recarga ${input.phone}`, input.amount, input.walletId),

    reallocateBenefit: () => true,

    scheduleDeposit: () => true,

    updateWalletLimit: (_, { input }, context) => {
      const wallets = getWallets(uid(context))
      const wallet = wallets.find(w => w.id === input.walletId)
      if (!wallet) return null
      return { ...wallet, limiteDisponivel: input.newLimit }
    },

    reclassifyTransaction: () => true,

    cashOut: (_, { input }) =>
      makeTx('cashout', 'Saque bancário', input.amount, input.walletId),

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

    executePixCashOut: (_, { input }) =>
      makeTx('cashout', `PIX Cash Out para ${input.chavePix}`, input.amount, input.walletId),

    statementExport: (_, { input }) => ({
      url: `https://mock.origami.com.br/statements/extrato.${input.format.toLowerCase()}`,
      format: input.format,
    }),

    // ── Cards ─────────────────────────────────────────────────────
    blockCard: (_, { id: cardId }, context) => {
      _state.cardStatus.set(cardId, 'bloqueado')
      const card = getCardById(uid(context), cardId)
      return { ...card, status: 'bloqueado' }
    },

    unblockCard: (_, { id: cardId }, context) => {
      _state.cardStatus.set(cardId, 'ativo')
      const card = getCardById(uid(context), cardId)
      return { ...card, status: 'ativo' }
    },

    createVirtualCard: (_, __, context) => {
      const userId = uid(context)
      const user = findUserById(userId)
      const name = user.nome.split(' ').map((w, i) => i < 2 ? w : w[0]).join(' ').toUpperCase()
      return {
        id: nextId('c'),
        tipo: 'virtual',
        status: 'ativo',
        bandeira: 'visa',
        ultimosDigitos: String(Math.floor(Math.random() * 9000) + 1000),
        nomePortador: name,
        validade: '06/30',
        carteirasVinculadas: ['Flexível'],
        contactless: false,
      }
    },

    activateCard: (_, { id: cardId }, context) => {
      _state.cardStatus.set(cardId, 'ativo')
      const card = getCardById(uid(context), cardId)
      return { ...card, status: 'ativo' }
    },

    validateCardPin: (_, { id, pin }) =>
      ok(),

    changeCardPin: (_, { id, newPin }) => {
      if (['0000', '1234', '4321'].includes(newPin)) {
        return { success: false, message: 'PIN inválido. Escolha outro.' }
      }
      return ok()
    },

    requestCardReplacement: () =>
      ({ success: true, message: `REP-${Date.now().toString().slice(-6)}` }),

    toggleInternationalMode: () => true,

    // ── Notifications ─────────────────────────────────────────────
    markNotificationRead: (_, { id }, context) => {
      const notifs = getNotifications(uid(context))
      const n = notifs.find(x => x.id === id)
      if (n) n.lida = true
      return { success: true, message: null }
    },
    markAllNotificationsRead: (_, __, context) => {
      getNotifications(uid(context)).forEach(n => { n.lida = true })
      return { success: true, message: null }
    },

    updateNotificationPreferences: (_, { input }, context) => {
      const userId = uid(context)
      _state.notifPrefs.set(userId, input)
      return input
    },

    // ── Partners ──────────────────────────────────────────────────
    toggleFavoritePartner: (_, { partnerId: id }, context) => {
      const userId = uid(context)
      if (!_state.favorites.has(userId)) _state.favorites.set(userId, new Set())
      const favs = _state.favorites.get(userId)
      if (favs.has(id)) { favs.delete(id); return false }
      favs.add(id); return true
    },

    // ── Disputes ──────────────────────────────────────────────────
    submitDispute: (_, { transactionId, description, amount, merchantName }) => {
      const d = { id: nextId('disp'), transactionId, description, amount, merchantName: merchantName ?? 'Estabelecimento', status: 'aberta', date: new Date().toISOString(), events: [{ date: new Date().toISOString(), description: 'Contestação aberta', status: 'aberta' }] }
      _state.sessionDisputes.push(d)
      return d
    },

    // ── Reimbursements ────────────────────────────────────────────
    submitReimbursement: (_, { category, amount, date, description, receiptUrl }) => {
      const r = { id: nextId('reimb'), category, amount, date, description, status: 'aguardando', receiptUrl: receiptUrl ?? null, resolvedAt: null }
      _state.sessionReimbursements.push(r)
      return r
    },

    // ── Balance Requests ──────────────────────────────────────────
    createBalanceRequest: (_, { input }) => {
      const r = { id: nextId('br'), walletId: input.walletId, amount: input.amount, status: 'aguardando', justificativa: input.justificativa ?? null, createdAt: new Date().toISOString(), updatedAt: null, approvedBy: null, rejectionReason: null }
      _state.sessionBalanceReqs.push(r)
      return r
    },

    updateBalanceRequest: (_, { input }) => {
      const req = BALANCE_REQUESTS.find(b => b.id === input.requestId)
      if (!req) return null
      return {
        ...req,
        status: input.status,
        updatedAt: new Date().toISOString(),
        rejectionReason: input.rejectionReason ?? null,
      }
    },

    // ── Digital Wallet ────────────────────────────────────────────
    addToGooglePay: () => true,
    addToSamsungPay: () => true,
    removeFromDigitalWallet: () => true,

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
      const item = APPROVALS.find(a => a.id === id) ?? APPROVALS[0]
      const updated = { status: 'aprovada', decidedAt: new Date().toISOString(), decidedBy: 'mock-manager', rejectionReason: null }
      _state.approvalOverrides.set(id, updated)
      return { ...item, ...updated }
    },

    rejectAction: (_, { id, reason }) => {
      const item = APPROVALS.find(a => a.id === id) ?? APPROVALS[0]
      const updated = { status: 'reprovado', decidedAt: new Date().toISOString(), decidedBy: 'mock-manager', rejectionReason: reason }
      _state.approvalOverrides.set(id, updated)
      return { ...item, ...updated }
    },

    // ── Feedback ──────────────────────────────────────────────────
    submitFeedback: () => ok(),

    // ── Rewards ───────────────────────────────────────────────────
    redeemReward: (_, { rewardId } = {}, context) => {
      const userId = uid(context)
      const current = _state.rewardOverrides.get(userId) ?? { totalPoints: REWARDS_SUMMARY.totalPoints, level: REWARDS_SUMMARY.level }
      const cost = REWARDS_SUMMARY.availableRewards?.find(r => r.id === rewardId)?.points ?? 500
      const newPoints = Math.max(0, current.totalPoints - cost)
      _state.rewardOverrides.set(userId, { ...current, totalPoints: newPoints })
      return ok()
    },

    // ── Expenses ──────────────────────────────────────────────────
    createExpense: (_, { input }) => {
      const e = { id: nextId('exp'), description: input.description, amount: input.amount, date: input.date, category: input.category, receiptUrl: input.receiptUrl ?? null, lat: input.lat ?? null, lng: input.lng ?? null, merchant: input.merchant ?? null }
      _state.sessionExpenses.push(e)
      return e
    },

    deleteExpense: () => ok(),

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
      const a = { id: nextId('adv'), amount: input.amount, reason: input.reason, status: 'pendente', requestedAt: new Date().toISOString(), resolvedAt: null, approverNote: null }
      _state.sessionAdvances.push(a)
      return a
    },

    // ── Reports ───────────────────────────────────────────────────
    createExpenseReport: (_, { input }) => {
      const r = { id: nextId('rep'), title: input.title, period: input.period, totalAmount: 0, expenseCount: input.expenseIds.length, status: 'rascunho', createdAt: new Date().toISOString(), submittedAt: null, expenseIds: input.expenseIds }
      _state.sessionReports.push(r)
      return r
    },

    submitExpenseReport: () => ok(),

    // ── Vouchers ──────────────────────────────────────────────────
    buyVoucher: (_, { input }) => {
      _state.purchasedVouchers.add(input.voucherId)
      const voucher = AVAILABLE_VOUCHERS.find(v => v.id === input.voucherId) ?? AVAILABLE_VOUCHERS[0]
      return { ...voucher, status: 'purchased', code: `MOCK${Date.now().toString().slice(-6)}` }
    },

    analyseVoucher: (_, { code }) =>
      AVAILABLE_VOUCHERS[0] ? { ...AVAILABLE_VOUCHERS[0], code } : null,

    // ── Geofencing ────────────────────────────────────────────────
    addGeofenceZone: (_, { input }) => ({ id: input.id }),
    removeGeofenceZone: () => true,

    toggleGeofenceZone: (_, { id }) => {
      const current = _state.geofenceActive.has(id) ? _state.geofenceActive.get(id) : (GEOFENCE_ZONES.find(z => z.id === id)?.ativo ?? true)
      _state.geofenceActive.set(id, !current)
      return !current
    },

    // ── External Benefits ─────────────────────────────────────────
    activateBenefit: (_, { id }) => {
      _state.benefitActive.set(id, true)
      return ok()
    },
  },
}
