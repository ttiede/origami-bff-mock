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
  SEED_FAVORITE_PARTNER_IDS as FAVORITE_PARTNER_IDS,
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
  buildSeedNextDeposits,
  buildSeedCardDeliveries,
  buildSeedKycResults,
  buildSeedSessions,
  buildSeedSecurityActivity,
  buildSeedClockEntries,
  buildSeedHourBank,
  buildSeedVacationBalance,
  buildSeedVacationHistory,
  buildSeedPayslips,
  buildSeedHrEvents,
  buildSeedClockLocks,
  buildSeedLoans,
  buildSeedTravels,
  buildSeedTravelPolicy,
  buildSeedBanks,
  buildSeedMobileCarriers,
  buildSeedMarketplaceOffers,
  buildSeedSavingsGoals,
  buildSeedTransportCards,
  buildSeedPixKeys,
  buildSeedClockEntriesByUser,
  buildSeedPayslipsByUser,
} from './seeds.js'

import {
  BANNERS, FAQS, EXTERNAL_BENEFITS, REWARDS_SUMMARY, SP_TRANS_CARDS,
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

  sessionsByUser: {},      // { [userId]: [AuthSession] }
  securityByUser: {},      // { [userId]: [SecurityEvent] }

  nextDepositsByUser: {},  // { [userId]: [{ walletId, amount, scheduledDate, description }] }
  cardDeliveries: {},      // { [cardId]: CardDelivery }
  kycResultsByUser: {},    // { [userId]: KycResult }

  // HR, Credit, Travel
  clockEntries: [],
  hourBank: null,
  vacationBalance: null,
  vacationHistory: [],
  payslips: [],
  hrEvents: [],
  clockLocks: [],
  loans: [],
  travels: [],
  travelPolicy: null,

  // New endpoints data
  banks: [],
  mobileCarriers: [],
  marketplaceOffers: [],
  savingsGoals: [],
  transportCards: [],

  // Per-user ephemeral state
  favorites: {},           // { [userId]: Set<partnerId> }
  notifPrefs: {},          // { [userId]: { pushEnabled, emailEnabled, smsEnabled } }
  rewardOverrides: {},     // { [userId]: { totalPoints, level } }
  sessions: {},            // { [userId]: { active: boolean, loginAt } }
  cardReplacements: [],    // [{ cardId, reason, createdAt }]
  scheduledDeposits: [],   // [{ walletId, amount, scheduledDate, userId }]

  // Transaction PIN per user
  transactionPins: {},     // { [userId]: string }

  // Travel expenses
  travelExpenses: [],      // [TravelExpense]

  // PIX registered keys per user
  pixKeysByUser: {},       // { [userId]: [PixRegisteredKey] }

  // Chat messages per user
  chatMessagesByUser: {},  // { [userId]: [ChatMessage] }

  // Terms acceptance per user
  termsAcceptance: {},     // { [userId]: { version, acceptedAt } }

  // PIN validated session per user (for sensitive data access)
  pinValidatedAt: {},      // { [userId]: timestamp }

  // #047: Reallocation cooldown tracking
  reallocationTimestamps: {},   // { [userId]: timestamp (last reallocation) }

  // #052: Duplicate payment detection
  recentPayments: [],           // [{ userId, amount, merchant, timestamp }]

  // #062: Per-card spending limits
  cardSpendingLimits: {},       // { [cardId]: { dailyLimit, monthlyLimit, singleTransactionLimit } }

  // #071: Card lock reasons
  cardLockReasons: {},          // { [cardId]: string (stolen|lost|suspicious|user_request) }

  // #088: Boleto duplicate detection
  recentBoletos: [],            // [{ userId, barcode, amount, timestamp }]
}

// ─── Failure simulation ─────────────────────────────────────────────────────
let _failureMode = { enabled: false, rate: 0.1 }

export function setFailureMode(enabled, rate = 0.1) {
  _failureMode = { enabled, rate }
}

export function shouldSimulateFailure() {
  if (!_failureMode.enabled) return false
  return Math.random() < _failureMode.rate
}

export function getFailureMode() {
  return { ..._failureMode }
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

// ─── Rate limiting & daily totals (declared before reset() to avoid TDZ) ────
const _failedAttempts = {}
const _dailyTotals = {}

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
  state.sessionsByUser = buildSeedSessions()
  state.securityByUser = buildSeedSecurityActivity()
  state.nextDepositsByUser = buildSeedNextDeposits()
  state.cardDeliveries = buildSeedCardDeliveries()
  state.kycResultsByUser = buildSeedKycResults()

  state.clockEntries = buildSeedClockEntries()
  state.hourBank = buildSeedHourBank()
  state.vacationBalance = buildSeedVacationBalance()
  state.vacationHistory = buildSeedVacationHistory()
  state.payslips = buildSeedPayslips()
  state.hrEvents = buildSeedHrEvents()
  state.clockLocks = buildSeedClockLocks()
  state.loans = buildSeedLoans()
  state.travels = buildSeedTravels()
  state.travelPolicy = buildSeedTravelPolicy()

  state.banks = buildSeedBanks()
  state.mobileCarriers = buildSeedMobileCarriers()
  state.marketplaceOffers = buildSeedMarketplaceOffers()
  state.savingsGoals = buildSeedSavingsGoals()
  state.transportCards = buildSeedTransportCards()

  state.favorites = {}
  state.notifPrefs = {}
  state.rewardOverrides = {}
  state.sessions = {}
  state.cardReplacements = []
  state.scheduledDeposits = []
  state.transactionPins = {}
  state.travelExpenses = []
  state.pixKeysByUser = buildSeedPixKeys()
  state.chatMessagesByUser = {}
  state.termsAcceptance = {}
  state.pinValidatedAt = {}
  state.reallocationTimestamps = {}
  state.recentPayments = []
  state.cardSpendingLimits = {}
  state.cardLockReasons = {}
  state.recentBoletos = []

  // Initialize default favorites from seed
  FAVORITE_PARTNER_IDS.forEach(pid => {
    if (!state.favorites['1']) state.favorites['1'] = new Set()
    state.favorites['1'].add(pid)
  })

  _mutations.total = 0
  _mutations.lastMutation = null
  _mutations.lastMutationAt = null

  // Clear rate limiting state (failed login/OTP/PIN attempts)
  Object.keys(_failedAttempts).forEach(k => delete _failedAttempts[k])
  Object.keys(_dailyTotals).forEach(k => delete _dailyTotals[k])

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
    // Defaults for receipt fields (overridden by spread if present in tx)
    direcao: tx.tipo === 'credito' ? 'credito' : 'debito',
    estabelecimento: tx.merchant ?? tx.descricao,
    walletTipo: tx.walletTipo ?? null,
    nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null,
    enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null,
    mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null,
    scheduledDate: null, pixDescription: null, boletoAuthNumber: null,
    // Spread tx AFTER defaults so seed receipt data wins
    ...tx,
  }))
}

export function getNotifications(userId) {
  return state.notificationsByUser[String(userId)] ?? state.notificationsByUser['1'] ?? []
}

export function getPartners(args = {}) {
  return state.partners.filter(p => {
    if (args.category && p.category !== args.category) return false
    if (args.benefit && !p.acceptedBenefits.includes(args.benefit)) return false
    if (args.search && !p.name.toLowerCase().includes(args.search.toLowerCase())) return false
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
export function getNextDeposits(userId) { return state.nextDepositsByUser[String(userId)] ?? [] }
export function hasNextDepositsEntry(userId) { return String(userId) in state.nextDepositsByUser }
export function getCardDelivery(cardId, userId) {
  // Try compound key first (user-specific), then direct cardId
  if (userId) {
    const compound = state.cardDeliveries[`${userId}:${cardId}`]
    if (compound) return compound
  }
  return state.cardDeliveries[cardId] ?? null
}
export function getKycResult(userId) { return state.kycResultsByUser[String(userId)] ?? null }

// Static data (never mutated)
export function getBanners() { return BANNERS }
export function getFaqs() { return FAQS }

// New endpoint getters (from state — dynamic)
export function getBanks() { return state.banks }
export function getMobileCarriers() { return state.mobileCarriers }
export function getMarketplaceOffers() { return state.marketplaceOffers }
export function getSavingsGoals() { return state.savingsGoals }
export function getTransportCards() { return state.transportCards }
export function getTravelExpenses(travelId) {
  return travelId ? state.travelExpenses.filter(e => e.travelId === travelId) : state.travelExpenses
}

// Sessions & security — now dynamic from state
export function getStaticSessionsList(userId) {
  return state.sessionsByUser[String(userId)] ?? state.sessionsByUser['1'] ?? []
}
export function getSecurityActivityList(userId) {
  return state.securityByUser[String(userId)] ?? state.securityByUser['1'] ?? []
}

// Nearby partners — Haversine distance filter
export function getNearbyPartners(lat, lng, radiusKm = 5) {
  const R = 6371 // Earth radius in km
  return state.partners.filter(p => {
    if (p.lat == null || p.lng == null) return false
    const dLat = (p.lat - lat) * Math.PI / 180
    const dLng = (p.lng - lng) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * Math.PI / 180) * Math.cos(p.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return dist <= radiusKm
  }).map(p => {
    // Recalculate distance string
    const dLat = (p.lat - lat) * Math.PI / 180
    const dLng = (p.lng - lng) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * Math.PI / 180) * Math.cos(p.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return { ...p, distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km` }
  }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
}

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

// ─── HR Getters ──────────────────────────────────────────────────────────────
export function getClockEntries() { return state.clockEntries }
export function getHourBank() { return state.hourBank }
export function getVacationBalance() { return state.vacationBalance }
export function getVacationHistory() { return state.vacationHistory }
export function getPayslips() { return state.payslips }
export function getHrEvents() { return state.hrEvents }
export function getClockLocks() { return state.clockLocks }

// ─── HR Mutators ─────────────────────────────────────────────────────────────
export function addClockEntry(entry) {
  state.clockEntries.push(entry)
  return entry
}

export function discardClockEntry(id) {
  const idx = state.clockEntries.findIndex(e => e.id === id)
  if (idx === -1) return false
  state.clockEntries[idx].approved = false
  state.clockEntries[idx].reason = 'Desconsiderado'
  return true
}

export function restoreClockEntry(id) {
  const idx = state.clockEntries.findIndex(e => e.id === id)
  if (idx === -1) return false
  state.clockEntries[idx].approved = true
  state.clockEntries[idx].reason = null
  return true
}

export function addVacationPeriod(period) {
  state.vacationHistory.push(period)
  if (state.vacationBalance) {
    state.vacationBalance.usedDays += period.daysCount
    state.vacationBalance.availableDays -= period.daysCount
  }
  return period
}

// ─── Credit Getters ──────────────────────────────────────────────────────────
export function getLoans() { return state.loans }
export function getLoanById(id) { return state.loans.find(l => l.id === id) ?? null }

// ─── Travel Getters & Mutators ───────────────────────────────────────────────
export function getTravels() { return state.travels }
export function getTravelById(id) { return state.travels.find(t => t.id === id) ?? null }
export function getTravelPolicy() { return state.travelPolicy }

export function addTravel(travel) {
  state.travels.push(travel)
  return travel
}

export function updateTravelStatus(id, status) {
  const t = state.travels.find(x => x.id === id)
  if (!t) return null
  t.status = status
  return t
}

export function removeTravel(id) {
  const idx = state.travels.findIndex(t => t.id === id)
  if (idx === -1) return false
  state.travels.splice(idx, 1)
  return true
}

export function addTravelExpense(travelId, { type, description, amount, date }) {
  const expense = {
    id: `texp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    travelId,
    type,
    description,
    amount,
    date,
    receiptUrl: null,
  }
  const travel = state.travels.find(t => t.id === travelId)
  if (travel) {
    travel.totalBudget += amount
  }
  return expense
}

// ─── Rate limiting / failed attempts tracking ──────────────────────────────

export function trackFailedAttempt(key) {
  if (!_failedAttempts[key]) _failedAttempts[key] = { count: 0, lockedUntil: null }
  _failedAttempts[key].count++
  if (_failedAttempts[key].count >= 5) {
    _failedAttempts[key].lockedUntil = Date.now() + 15 * 60 * 1000 // 15 min
  }
  return _failedAttempts[key]
}

export function isRateLimited(key) {
  const entry = _failedAttempts[key]
  if (!entry) return false
  if (entry.lockedUntil && Date.now() < entry.lockedUntil) return true
  if (entry.lockedUntil && Date.now() >= entry.lockedUntil) {
    delete _failedAttempts[key]
    return false
  }
  return false
}

export function clearFailedAttempts(key) { delete _failedAttempts[key] }

// ─── Daily transaction totals tracking ──────────────────────────────────────

export function getDailyTotal(userId) {
  const today = new Date().toISOString().slice(0, 10)
  const key = `${userId}:${today}`
  return _dailyTotals[key] ?? 0
}

export function addToDailyTotal(userId, amount) {
  const today = new Date().toISOString().slice(0, 10)
  const key = `${userId}:${today}`
  _dailyTotals[key] = (_dailyTotals[key] ?? 0) + amount
  return _dailyTotals[key]
}

const DAILY_LIMIT = 50000 // R$ 50.000 daily transaction limit

export function getDailyLimit() { return DAILY_LIMIT }

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
    banks: state.banks.length,
    mobileCarriers: state.mobileCarriers.length,
    marketplaceOffers: state.marketplaceOffers.length,
    savingsGoals: state.savingsGoals.length,
    transportCards: state.transportCards.length,
    loans: state.loans.length,
    travels: state.travels.length,
    travelExpenses: state.travelExpenses.length,
    clockEntries: state.clockEntries.length,
    payslips: state.payslips.length,
    hrEvents: state.hrEvents.length,
    vacationHistory: state.vacationHistory.length,
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

/** Transaction PIN management */
export function setTransactionPin(userId, pin) {
  state.transactionPins[String(userId)] = pin
}

export function getTransactionPin(userId) {
  return state.transactionPins[String(userId)] ?? null
}

/** Travel expense storage */
export function storeTravelExpense(expense) {
  state.travelExpenses.push(expense)
  return expense
}

/** User mutations */
export function validateUserPassword(cpf, currentPassword) {
  const user = findUserByCpf(cpf)
  if (!user) return false
  // First-access users have null password — skip current password check
  if (user.senha === null) return true
  return user.senha === currentPassword
}

export function updateUserPassword(cpf, newPassword) {
  const user = findUserByCpf(cpf)
  if (!user) return false
  user.senha = newPassword
  if (user.primeiroAcesso) user.primeiroAcesso = false
  return true
}

/** Update user profile fields */
export function updateUserProfile(userId, updates) {
  const user = findUserById(userId)
  if (!user) return null
  if (updates.nome) user.nome = updates.nome
  if (updates.email) user.email = updates.email
  if (updates.telefone) user.telefone = updates.telefone
  if (updates.departamento) user.departamento = updates.departamento
  if (updates.cargo) user.cargo = updates.cargo
  return user
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

// ─── PIX Keys ──────────────────────────────────────────────────────────────
export function getPixKeys(userId) {
  return state.pixKeysByUser[String(userId)] ?? []
}

export function addPixKey(userId, key) {
  const uid = String(userId)
  if (!state.pixKeysByUser[uid]) state.pixKeysByUser[uid] = []
  state.pixKeysByUser[uid].push(key)
  return key
}

// ─── Chat Messages ─────────────────────────────────────────────────────────
export function getChatMessages(userId) {
  return state.chatMessagesByUser[String(userId)] ?? []
}

export function addChatMessage(userId, msg) {
  const uid = String(userId)
  if (!state.chatMessagesByUser[uid]) state.chatMessagesByUser[uid] = []
  state.chatMessagesByUser[uid].push(msg)
  return msg
}

// ─── Terms Acceptance ──────────────────────────────────────────────────────
export function acceptTerms(userId, version) {
  state.termsAcceptance[String(userId)] = { version, acceptedAt: new Date().toISOString() }
}

export function getTermsAcceptance(userId) {
  return state.termsAcceptance[String(userId)] ?? null
}

// ─── PIN Validation Session ────────────────────────────────────────────────
export function setPinValidated(userId) {
  state.pinValidatedAt[String(userId)] = Date.now()
}

export function isPinRecentlyValidated(userId) {
  const ts = state.pinValidatedAt[String(userId)]
  if (!ts) return false
  // Valid for 5 minutes
  return (Date.now() - ts) < 5 * 60 * 1000
}

// ─── Savings Goal Mutations ────────────────────────────────────────────────
export function addSavingsGoal(goal) {
  state.savingsGoals.push(goal)
  return goal
}

export function updateSavingsGoal(goalId, updates) {
  const goal = state.savingsGoals.find(g => g.id === goalId)
  if (!goal) return null
  Object.assign(goal, updates)
  return goal
}

// ─── Per-user Clock Entries ────────────────────────────────────────────────
export function getClockEntriesForUser(userId) {
  return state.clockEntries.filter(e => e.employeeId === String(userId))
}

// ─── #047: Reallocation Cooldown ─────────────────────────────────────────
export function getLastReallocationTime(userId) {
  return state.reallocationTimestamps[String(userId)] ?? null
}

export function setLastReallocationTime(userId) {
  state.reallocationTimestamps[String(userId)] = Date.now()
}

// ─── #052: Duplicate Payment Detection ──────────────────────────────────
export function trackRecentPayment(userId, amount, merchant) {
  state.recentPayments.push({ userId: String(userId), amount, merchant, timestamp: Date.now() })
  // Keep only last 100 entries
  if (state.recentPayments.length > 100) state.recentPayments.shift()
}

export function isDuplicatePayment(userId, amount, merchant) {
  const now = Date.now()
  const sixtySecondsAgo = now - 60000
  return state.recentPayments.some(p =>
    p.userId === String(userId) &&
    p.amount === amount &&
    p.merchant === merchant &&
    p.timestamp >= sixtySecondsAgo
  )
}

// ─── #062: Per-card Spending Limits ─────────────────────────────────────
export function getCardSpendingLimits(cardId) {
  return state.cardSpendingLimits[cardId] ?? { dailyLimit: 5000, monthlyLimit: 25000, singleTransactionLimit: 5000 }
}

export function setCardSpendingLimits(cardId, limits) {
  state.cardSpendingLimits[cardId] = { ...getCardSpendingLimits(cardId), ...limits }
  return state.cardSpendingLimits[cardId]
}

// ─── #071: Card Lock Reasons ────────────────────────────────────────────
export function setCardLockReason(cardId, reason) {
  state.cardLockReasons[cardId] = reason
}

export function getCardLockReason(cardId) {
  return state.cardLockReasons[cardId] ?? null
}

// ─── #075: Card Linked Wallet Update ────────────────────────────────────
export function updateCardLinkedWallets(userId, cardId, wallets) {
  const cards = getCards(userId)
  const card = cards.find(c => c.id === cardId)
  if (!card) return null
  card.carteirasVinculadas = wallets
  return card
}

// ─── #061: Contactless Toggle ───────────────────────────────────────────
export function setCardContactless(userId, cardId, enabled) {
  const cards = getCards(userId)
  const card = cards.find(c => c.id === cardId)
  if (!card) return null
  card.contactless = enabled
  return card
}

// ─── #088: Boleto Duplicate Detection ───────────────────────────────────
export function trackRecentBoleto(userId, barcode, amount) {
  state.recentBoletos.push({ userId: String(userId), barcode, amount, timestamp: Date.now() })
  if (state.recentBoletos.length > 50) state.recentBoletos.shift()
}

export function isDuplicateBoleto(userId, barcode) {
  const now = Date.now()
  const oneHourAgo = now - 3600000
  return state.recentBoletos.some(b =>
    b.userId === String(userId) &&
    b.barcode === barcode &&
    b.timestamp >= oneHourAgo
  )
}
