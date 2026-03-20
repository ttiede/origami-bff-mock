// ─── Centralized State Manager ──────────────────────────────────────────────
// All queries read from state. All mutations modify state.
// reset() restores everything to seed data (deep clone).

import {
  SEED_USERS,
  SEED_PARTNERS,
  SEED_CARDS_BY_USER,
  SEED_GEOFENCE_ZONES,
  SEED_DIGITAL_WALLET_CARDS,
  SENSITIVE_DATA,
  FAVORITE_PARTNER_IDS,
  buildSeedWallets,
  buildSeedTransactions,
  buildSeedNotifications,
  buildSeedApprovals,
  buildSeedDisputes,
  buildSeedReimbursements,
  buildSeedBalanceRequests,
  buildSeedExpenses,
  buildSeedAdvances,
  buildSeedReports,
  buildSeedAvailableVouchers,
  buildSeedMyVouchers,
} from './seeds.js'

import {
  BANNERS, FAQS, EXTERNAL_BENEFITS, REWARDS_SUMMARY, SP_TRANS_CARDS,
  getStaticSessions, getSecurityActivity,
} from './data/static.js'

// ─── Deep clone utility ─────────────────────────────────────────────────────
function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// ─── The State ──────────────────────────────────────────────────────────────
const state = {
  users: [],
  walletsByUser: {},
  cardsByUser: {},
  transactionsByUser: {},
  notificationsByUser: {},
  partners: [],
  approvals: [],
  disputes: [],
  reimbursements: [],
  balanceRequests: [],
  expenses: [],
  advances: [],
  reports: [],
  availableVouchers: [],
  myVouchers: [],
  geofenceZones: [],
  digitalWalletCards: [],
  externalBenefits: [],
  rewardsSummary: null,

  // Per-user ephemeral state
  favorites: {},           // { [userId]: Set<partnerId> }
  notifPrefs: {},          // { [userId]: { pushEnabled, emailEnabled, smsEnabled } }
  rewardOverrides: {},     // { [userId]: { totalPoints, level } }
  sessions: {},            // { [userId]: { active: boolean, loginAt } }
  cardReplacements: [],    // [{ cardId, reason, createdAt }]
  scheduledDeposits: [],   // [{ walletId, amount, scheduledDate, userId }]
}

// ─── Sequence counter for IDs ───────────────────────────────────────────────
let _seq = 1
export function nextId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${_seq++}`
}

// ─── Timestamp helper ───────────────────────────────────────────────────────
function ts() {
  return new Date().toISOString().slice(11, 19)
}

// ─── Mutation tracker ────────────────────────────────────────────────────────
const _mutations = { total: 0, lastMutation: null, lastMutationAt: null }

export function logMutation(name, detail) {
  _mutations.total++
  _mutations.lastMutation = name
  _mutations.lastMutationAt = new Date().toISOString()
  console.log(`[${ts()}] MUTATION ${name.padEnd(30)} | ${detail}`)
}

export function getMutationStats() {
  return { ..._mutations }
}

// ─── Initialize / Reset ─────────────────────────────────────────────────────
export function reset() {
  _seq = 1
  state.users = clone(SEED_USERS)
  state.walletsByUser = buildSeedWallets()
  state.cardsByUser = clone(SEED_CARDS_BY_USER)
  state.transactionsByUser = buildSeedTransactions()
  state.notificationsByUser = buildSeedNotifications()
  state.partners = clone(SEED_PARTNERS)
  state.approvals = buildSeedApprovals()
  state.disputes = buildSeedDisputes()
  state.reimbursements = buildSeedReimbursements()
  state.balanceRequests = buildSeedBalanceRequests()
  state.expenses = buildSeedExpenses()
  state.advances = buildSeedAdvances()
  state.reports = buildSeedReports()
  state.availableVouchers = buildSeedAvailableVouchers()
  state.myVouchers = buildSeedMyVouchers()
  state.geofenceZones = clone(SEED_GEOFENCE_ZONES)
  state.digitalWalletCards = clone(SEED_DIGITAL_WALLET_CARDS)
  state.externalBenefits = clone(EXTERNAL_BENEFITS)
  state.rewardsSummary = clone(REWARDS_SUMMARY)

  state.favorites = {}
  state.notifPrefs = {}
  state.rewardOverrides = {}
  state.sessions = {}
  state.cardReplacements = []
  state.scheduledDeposits = []

  // Initialize default favorites from seed
  FAVORITE_PARTNER_IDS.forEach(pid => {
    if (!state.favorites['1']) state.favorites['1'] = new Set()
    state.favorites['1'].add(pid)
  })

  _mutations.total = 0
  _mutations.lastMutation = null
  _mutations.lastMutationAt = null

  console.log(`[${ts()}] STATE    Reset to seed data — all state cleared`)
}

// Initialize on import
reset()

// ─── Getters (read from state) ──────────────────────────────────────────────

export function getUsers() { return state.users }

export function findUserByCpf(cpf) {
  const clean = cpf.replace(/\D/g, '')
  return state.users.find(u => u.cpf === clean) ?? null
}

export function findUserById(id) {
  return state.users.find(u => u.id === String(id)) ?? state.users[0]
}

export function getWallets(userId) {
  return state.walletsByUser[String(userId)] ?? state.walletsByUser['1'] ?? []
}

export function findWallet(userId, walletId) {
  const wallets = getWallets(userId)
  return wallets.find(w => w.id === walletId) ?? null
}

export function getCards(userId) {
  return state.cardsByUser[String(userId)] ?? state.cardsByUser['1'] ?? []
}

export function getCardById(userId, cardId) {
  const cards = getCards(userId)
  return cards.find(c => c.id === cardId) ?? cards[0]
}

export function getTransactions(userId) {
  const txs = state.transactionsByUser[String(userId)] ?? []
  return txs.map(tx => ({
    ...tx,
    direcao: tx.tipo === 'credito' ? 'credito' : 'debito',
    estabelecimento: tx.merchant ?? tx.descricao,
    walletTipo: null,
    nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null,
    enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null,
    mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null,
  }))
}

export function getNotifications(userId) {
  return state.notificationsByUser[String(userId)] ?? state.notificationsByUser['1'] ?? []
}

export function getPartners(args = {}) {
  return state.partners.filter(p => {
    if (args.category && p.category !== args.category) return false
    if (args.benefit && !p.acceptedBenefits.includes(args.benefit)) return false
    return true
  })
}

export function getPartnerById(id) {
  return state.partners.find(p => p.id === id) ?? null
}

export function getFavoritePartners(userId) {
  const favSet = state.favorites[userId]
  if (!favSet || favSet.size === 0) {
    // Default favorites
    return state.partners.filter(p => FAVORITE_PARTNER_IDS.includes(p.id))
  }
  return state.partners.filter(p => favSet.has(p.id))
}

export function getApprovals() { return state.approvals }
export function getDisputes() { return state.disputes }
export function getReimbursements() { return state.reimbursements }
export function getBalanceRequests() { return state.balanceRequests }
export function getExpenses() { return state.expenses }
export function getAdvances() { return state.advances }
export function getReports() { return state.reports }
export function getAvailableVouchers() { return state.availableVouchers }
export function getMyVouchers() { return state.myVouchers }
export function getGeofenceZones() { return state.geofenceZones }
export function getDigitalWalletCards() { return state.digitalWalletCards }
export function getExternalBenefits() { return state.externalBenefits }
export function getRewardsSummary(userId) {
  const ov = state.rewardOverrides[userId]
  return ov ? { ...state.rewardsSummary, ...ov } : state.rewardsSummary
}
export function getNotifPrefs(userId) {
  return state.notifPrefs[userId] ?? { pushEnabled: true, emailEnabled: true, smsEnabled: false }
}
export function getSensitiveData() { return SENSITIVE_DATA }
export function getScheduledDeposits() { return state.scheduledDeposits }

// Static data (never mutated)
export function getBanners() { return BANNERS }
export function getFaqs() { return FAQS }
export function getStaticSessionsList() { return getStaticSessions() }
export function getSecurityActivityList() { return getSecurityActivity() }

// ─── Mutators ───────────────────────────────────────────────────────────────

/** Deduct amount from wallet, return updated wallet or null */
export function deductWallet(userId, walletId, amount) {
  const wallet = findWallet(userId, walletId)
  if (!wallet) return null
  wallet.saldo = parseFloat((wallet.saldo - amount).toFixed(2))
  wallet.ultimaAtualizacao = new Date().toISOString()
  return wallet
}

/** Add amount to wallet */
export function creditWallet(userId, walletId, amount) {
  const wallet = findWallet(userId, walletId)
  if (!wallet) return null
  wallet.saldo = parseFloat((wallet.saldo + amount).toFixed(2))
  wallet.ultimaAtualizacao = new Date().toISOString()
  return wallet
}

/** Add a transaction to user's list */
export function addTransaction(userId, tx) {
  const uid = String(userId)
  if (!state.transactionsByUser[uid]) state.transactionsByUser[uid] = []
  state.transactionsByUser[uid].unshift(tx) // newest first
  return tx
}

/** Update card status */
export function setCardStatus(userId, cardId, status) {
  const card = getCards(userId).find(c => c.id === cardId)
  if (card) card.status = status
  return card
}

/** Add a new card */
export function addCard(userId, card) {
  const uid = String(userId)
  if (!state.cardsByUser[uid]) state.cardsByUser[uid] = []
  state.cardsByUser[uid].push(card)
  return card
}

/** Update card PIN */
export function setCardPin(userId, cardId, newPin) {
  const card = getCards(userId).find(c => c.id === cardId)
  if (card) card.pin = newPin
  return card
}

/** Get card PIN */
export function getCardPin(userId, cardId) {
  const card = getCards(userId).find(c => c.id === cardId)
  return card?.pin ?? null
}

/** Add card replacement record */
export function addCardReplacement(cardId, reason) {
  const rec = { cardId, reason, createdAt: new Date().toISOString() }
  state.cardReplacements.push(rec)
  return rec
}

/** Mark notification read */
export function markNotifRead(userId, notifId) {
  const notifs = getNotifications(userId)
  const n = notifs.find(x => x.id === notifId)
  if (n) n.lida = true
  return !!n
}

/** Mark all notifications read */
export function markAllNotifsRead(userId) {
  const notifs = state.notificationsByUser[String(userId)]
  if (notifs) notifs.forEach(n => { n.lida = true })
}

/** Set notification preferences */
export function setNotifPrefs(userId, prefs) {
  state.notifPrefs[userId] = prefs
}

/** Toggle favorite partner */
export function toggleFavorite(userId, partnerId) {
  if (!state.favorites[userId]) state.favorites[userId] = new Set()
  const favs = state.favorites[userId]
  if (favs.has(partnerId)) { favs.delete(partnerId); return false }
  favs.add(partnerId); return true
}

/** Add dispute */
export function addDispute(dispute) {
  state.disputes.push(dispute)
  return dispute
}

/** Add reimbursement */
export function addReimbursement(reimb) {
  state.reimbursements.push(reimb)
  return reimb
}

/** Add/update balance request */
export function addBalanceRequest(req) {
  state.balanceRequests.push(req)
  return req
}

export function updateBalanceRequestStatus(requestId, status, rejectionReason) {
  const req = state.balanceRequests.find(b => b.id === requestId)
  if (!req) return null
  req.status = status
  req.updatedAt = new Date().toISOString()
  if (rejectionReason) req.rejectionReason = rejectionReason
  if (status === 'aprovado') req.approvedBy = 'mock-manager'
  return req
}

/** Approve / reject action */
export function approveAction(id) {
  const item = state.approvals.find(a => a.id === id)
  if (!item) return null
  item.status = 'aprovada'
  item.decidedAt = new Date().toISOString()
  item.decidedBy = 'mock-manager'
  item.rejectionReason = null
  return item
}

export function rejectAction(id, reason) {
  const item = state.approvals.find(a => a.id === id)
  if (!item) return null
  item.status = 'reprovado'
  item.decidedAt = new Date().toISOString()
  item.decidedBy = 'mock-manager'
  item.rejectionReason = reason
  return item
}

/** Expenses */
export function addExpense(expense) {
  state.expenses.push(expense)
  return expense
}

export function deleteExpense(id) {
  const idx = state.expenses.findIndex(e => e.id === id)
  if (idx === -1) return false
  state.expenses.splice(idx, 1)
  return true
}

/** Advances */
export function addAdvance(advance) {
  state.advances.push(advance)
  return advance
}

/** Reports */
export function addReport(report) {
  state.reports.push(report)
  return report
}

export function submitReport(id) {
  const report = state.reports.find(r => r.id === id)
  if (!report) return false
  report.status = 'submetido'
  report.submittedAt = new Date().toISOString()
  return true
}

/** Vouchers */
export function buyVoucher(voucherId, walletId, userId) {
  const vIdx = state.availableVouchers.findIndex(v => v.id === voucherId)
  if (vIdx === -1) return null
  const voucher = state.availableVouchers[vIdx]

  // Deduct from wallet
  if (voucher.salePrice > 0) {
    deductWallet(userId, walletId, voucher.salePrice)
  }

  // Move to purchased
  const purchased = {
    ...voucher,
    status: 'purchased',
    code: `MOCK${Date.now().toString().slice(-6)}`,
  }
  state.availableVouchers.splice(vIdx, 1)
  state.myVouchers.push(purchased)
  return purchased
}

/** Geofence zones */
export function addGeofenceZone(zone) {
  state.geofenceZones.push(zone)
  return zone
}

export function removeGeofenceZone(id) {
  const idx = state.geofenceZones.findIndex(z => z.id === id)
  if (idx === -1) return false
  state.geofenceZones.splice(idx, 1)
  return true
}

export function toggleGeofenceZone(id, active) {
  const zone = state.geofenceZones.find(z => z.id === id)
  if (!zone) return null
  zone.isActive = active
  return zone.isActive
}

/** Update wallet limit */
export function updateWalletLimit(userId, walletId, newLimit) {
  const wallet = findWallet(userId, walletId)
  if (!wallet) return null
  wallet.limiteDisponivel = newLimit
  wallet.ultimaAtualizacao = new Date().toISOString()
  return wallet
}

/** Schedule deposit */
export function addScheduledDeposit(userId, walletId, amount, scheduledDate) {
  const dep = { userId, walletId, amount, scheduledDate, createdAt: new Date().toISOString() }
  state.scheduledDeposits.push(dep)
  return dep
}

/** Digital wallet */
export function addToDigitalWallet(cardId, provider) {
  const card = state.digitalWalletCards.find(c => c.cardId === cardId && c.provider === provider)
  if (card) {
    card.isProvisioned = true
    card.tokenId = `tok-${provider.replace('_', '-')}-${Date.now()}`
    return true
  }
  // Create new entry
  const srcCard = Object.values(state.cardsByUser).flat().find(c => c.id === cardId)
  if (!srcCard) return false
  state.digitalWalletCards.push({
    cardId,
    cardLast4: srcCard.ultimosDigitos,
    cardBrand: srcCard.bandeira,
    cardNome: srcCard.nomePortador,
    provider,
    isProvisioned: true,
    tokenId: `tok-${provider.replace('_', '-')}-${Date.now()}`,
  })
  return true
}

export function removeFromDigitalWallet(cardId, provider) {
  const idx = state.digitalWalletCards.findIndex(c => c.cardId === cardId && c.provider === provider)
  if (idx === -1) return false
  state.digitalWalletCards.splice(idx, 1)
  return true
}

/** External benefits */
export function activateBenefit(id) {
  const b = state.externalBenefits.find(x => x.id === id)
  if (b) b.ativo = true
  return !!b
}

/** Rewards */
export function redeemReward(userId, rewardId) {
  const cost = state.rewardsSummary.availableRewards?.find(r => r.id === rewardId)?.points ?? 500
  const current = state.rewardOverrides[userId] ?? {
    totalPoints: state.rewardsSummary.totalPoints,
    level: state.rewardsSummary.level,
  }
  const newPoints = Math.max(0, current.totalPoints - cost)
  state.rewardOverrides[userId] = { ...current, totalPoints: newPoints }
  return newPoints
}

/** Reclassify transaction */
export function reclassifyTransaction(userId, transactionId, newCategory) {
  const txs = state.transactionsByUser[String(userId)]
  if (!txs) return false
  const tx = txs.find(t => t.id === transactionId)
  if (!tx) return false
  tx.categoria = newCategory
  return true
}

/** State summary for /status endpoint */
export function getStateSummary() {
  const totalWallets = Object.values(state.walletsByUser).reduce((s, w) => s + w.length, 0)
  const totalCards = Object.values(state.cardsByUser).reduce((s, c) => s + c.length, 0)
  const totalTransactions = Object.values(state.transactionsByUser).reduce((s, t) => s + t.length, 0)
  const totalNotifications = Object.values(state.notificationsByUser).reduce((s, n) => s + n.length, 0)
  return {
    users: state.users.length,
    wallets: totalWallets,
    cards: totalCards,
    transactions: totalTransactions,
    notifications: totalNotifications,
    approvals: state.approvals.length,
    expenses: state.expenses.length,
    advances: state.advances.length,
    reports: state.reports.length,
    vouchers: {
      available: state.availableVouchers.length,
      purchased: state.myVouchers.length,
    },
    disputes: state.disputes.length,
    reimbursements: state.reimbursements.length,
    balanceRequests: state.balanceRequests.length,
    geofenceZones: state.geofenceZones.length,
    digitalWalletCards: state.digitalWalletCards.length,
  }
}

/** Login session tracking */
export function trackLogin(userId) {
  state.sessions[userId] = { active: true, loginAt: new Date().toISOString() }
}

export function trackLogout(userId) {
  if (state.sessions[userId]) {
    state.sessions[userId].active = false
  }
}

/** User mutations */
export function updateUserPassword(cpf, newPassword) {
  const user = findUserByCpf(cpf)
  if (!user) return false
  user.senha = newPassword
  if (user.primeiroAcesso) user.primeiroAcesso = false
  return true
}

export function incrementFailedAttempts(userId) {
  const user = findUserById(userId)
  if (user) user.tentativasFalhas++
  return user
}

export function resetFailedAttempts(userId) {
  const user = findUserById(userId)
  if (user) user.tentativasFalhas = 0
  return user
}
