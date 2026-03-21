// ─── Request Logger ────────────────────────────────────────────────────────
// Ring buffer of last 500 requests, accessible via /logs endpoint.
// Each entry includes: timestamp, operation, type, user, variables, response, duration, errors.

const MAX_LOG_SIZE = 500

const _logs = []
let _logSeq = 0

export function logRequest(entry) {
  _logSeq++
  const log = {
    id: _logSeq,
    timestamp: new Date().toISOString(),
    ...entry,
  }
  _logs.push(log)
  if (_logs.length > MAX_LOG_SIZE) _logs.shift()
  return log
}

export function getLogs({ limit = 50, offset = 0, operation, type, user, status } = {}) {
  let filtered = _logs.slice().reverse() // newest first

  if (operation) filtered = filtered.filter(l => l.operation?.includes(operation))
  if (type) filtered = filtered.filter(l => l.type === type)
  if (user) filtered = filtered.filter(l => l.userId === user)
  if (status) filtered = filtered.filter(l => l.status === status)

  const total = filtered.length
  const paginated = filtered.slice(offset, offset + limit)

  return { total, offset, limit, logs: paginated }
}

export function clearLogs() {
  _logs.length = 0
  _logSeq = 0
}

export function getLogStats() {
  const total = _logs.length
  const queries = _logs.filter(l => l.type === 'query').length
  const mutations = _logs.filter(l => l.type === 'mutation').length
  const errors = _logs.filter(l => l.status === 'error').length
  const users = [...new Set(_logs.map(l => l.userId).filter(Boolean))]
  const operations = {}
  _logs.forEach(l => {
    if (!operations[l.operation]) operations[l.operation] = 0
    operations[l.operation]++
  })

  // Top 10 operations
  const topOps = Object.entries(operations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([op, count]) => ({ operation: op, count }))

  return {
    total, queries, mutations, errors,
    uniqueUsers: users.length, users,
    topOperations: topOps,
    oldestLog: _logs[0]?.timestamp ?? null,
    newestLog: _logs[_logs.length - 1]?.timestamp ?? null,
  }
}

// ─── Scenario control ──────────────────────────────────────────────────────
// Tests can set a scenario via X-Test-Scenario header to control mock behavior.
// Example: X-Test-Scenario: pix_insufficient_balance
//
// This is OPTIONAL — without the header, normal mock behavior applies.

const _activeScenarios = {}

export function setScenario(key, config) {
  _activeScenarios[key] = { ...config, setAt: new Date().toISOString() }
}

export function getScenario(key) {
  return _activeScenarios[key] ?? null
}

export function clearScenarios() {
  Object.keys(_activeScenarios).forEach(k => delete _activeScenarios[k])
}

export function getActiveScenarios() {
  return { ..._activeScenarios }
}

// Pre-defined test scenarios
export const TEST_SCENARIOS = {
  // Payment scenarios
  pix_success: { description: 'PIX transfer succeeds normally' },
  pix_insufficient_balance: { description: 'PIX fails with 422 insufficient balance', forceError: { operation: 'pixTransfer', code: 'INSUFFICIENT_BALANCE', status: 422, message: 'Saldo insuficiente.' } },
  pix_daily_limit: { description: 'PIX fails with 422 daily limit exceeded', forceError: { operation: 'pixTransfer', code: 'DAILY_LIMIT_EXCEEDED', status: 422, message: 'Limite diário excedido.' } },
  pix_timeout: { description: 'PIX simulates timeout (5s delay)', delay: 5000 },
  boleto_invalid: { description: 'Boleto barcode is invalid', forceError: { operation: 'payBoleto', code: 'INVALID_BARCODE', status: 400, message: 'Código de barras inválido.' } },

  // Auth scenarios
  login_blocked: { description: 'User is permanently blocked', forceError: { operation: 'login', code: 'FORBIDDEN', status: 403, message: 'Conta bloqueada.' } },
  login_rate_limited: { description: 'Login rate limited (429)', forceError: { operation: 'login', code: 'RATE_LIMITED', status: 429, message: 'Muitas tentativas.' } },
  otp_invalid: { description: 'OTP code is invalid', forceError: { operation: 'verifyOtp', code: 'UNAUTHORIZED', status: 401, message: 'Código inválido.' } },

  // Card scenarios
  card_already_blocked: { description: 'Card is already blocked', forceError: { operation: 'blockCard', code: 'CONFLICT', status: 409, message: 'Cartão já bloqueado.' } },

  // Network scenarios
  server_error: { description: 'Server returns 500', forceError: { operation: '*', code: 'INTERNAL_ERROR', status: 500, message: 'Erro interno do servidor.' } },
  slow_response: { description: 'All responses delayed 3s', delay: 3000 },

  // Empty data scenarios
  empty_wallets: { description: 'No wallets for user', emptyData: ['wallets'] },
  empty_cards: { description: 'No cards for user', emptyData: ['cards'] },
  empty_notifications: { description: 'No notifications', emptyData: ['notifications'] },
  empty_all: { description: 'All data empty', emptyData: ['wallets', 'cards', 'notifications', 'transactions'] },
}
// deploy trigger 1774067711
