import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'
import { reset, getStateSummary, getMutationStats } from './state.js'

const startedAt = Date.now()

// ─── Auto-reset sandbox every 60 minutes ────────────────────────────────────
const RESET_INTERVAL_MS = 60 * 60 * 1000 // 1 hour
let lastResetAt = Date.now()

setInterval(() => {
  reset()
  lastResetAt = Date.now()
  console.log(`[${new Date().toISOString()}] Auto-reset: sandbox restored to seed data`)
}, RESET_INTERVAL_MS)

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/graphql',
  cors: {
    origin: '*',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-App-Version',
      'X-Platform',
      'X-API-Version',
    ],
    methods: ['POST', 'GET', 'OPTIONS'],
  },
  logging: {
    debug: () => {},
    info: () => {},
    warn: (...args) => console.warn('[WARN] ', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
  },
  plugins: [
    {
      onExecute({ args }) {
        const op = args.document?.definitions?.[0]
        const opName = op?.name?.value ?? '(anonymous)'
        const opType = op?.operation ?? 'query'
        const auth = args.contextValue?.request?.headers?.get('authorization') ?? '-'
        const userId = auth.startsWith('Bearer origami-mock-')
          ? auth.replace('Bearer origami-mock-', 'user:')
          : auth !== '-' ? 'jwt' : 'anon'
        const ts = new Date().toISOString().slice(11, 23)
        const vars = args.variableValues && Object.keys(args.variableValues).length > 0
          ? ` vars=${JSON.stringify(args.variableValues)}`
          : ''
        console.log(`[${ts}] ${opType.toUpperCase().padEnd(8)} ${opName.padEnd(35)} | ${userId}${vars}`)
      },
      onExecuteDone({ result }) {
        const ts = new Date().toISOString().slice(11, 23)
        if (result?.errors?.length) {
          result.errors.forEach(e => {
            console.error(`[${ts}] ERROR    ${e.message}`)
          })
        }
        // Log response summary (first 200 chars of data keys)
        if (result?.data) {
          const keys = Object.keys(result.data)
          const summary = keys.map(k => {
            const v = result.data[k]
            if (v === null) return `${k}=null`
            if (Array.isArray(v)) return `${k}=[${v.length} items]`
            if (typeof v === 'object') return `${k}={...}`
            return `${k}=${v}`
          }).join(', ')
          console.log(`[${ts}] RESPONSE ${summary}`)
        }
      },
    },
  ],
})

const PORT = parseInt(process.env.PORT ?? '8080', 10)

// ─── Uptime helper ──────────────────────────────────────────────────────────
function formatUptime() {
  const ms = Date.now() - startedAt
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}h ${m}m`
}

// ─── Landing page HTML ──────────────────────────────────────────────────────
function landingPage() {
  const BASE = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Origami BFF Mock</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f1729;color:#e2e8f0;line-height:1.6;padding:2rem}
    .container{max-width:900px;margin:0 auto}
    h1{font-size:2rem;color:#60a5fa;margin-bottom:.5rem}
    h2{font-size:1.3rem;color:#93c5fd;margin:2rem 0 .75rem;border-bottom:1px solid #1e3a5f;padding-bottom:.5rem}
    p{color:#94a3b8;margin-bottom:1rem}
    .badge{display:inline-block;background:#1e3a5f;color:#60a5fa;padding:.15rem .6rem;border-radius:4px;font-size:.8rem;margin-bottom:1rem}
    table{width:100%;border-collapse:collapse;margin-bottom:1.5rem;font-size:.9rem}
    th{background:#1e293b;color:#93c5fd;text-align:left;padding:.6rem .8rem;border:1px solid #1e3a5f}
    td{padding:.5rem .8rem;border:1px solid #1e3a5f}
    tr:nth-child(even){background:#1a2332}
    code{background:#1e293b;padding:.15rem .4rem;border-radius:3px;font-size:.85rem;color:#f472b6}
    pre{background:#1e293b;padding:1rem;border-radius:6px;overflow-x:auto;margin-bottom:1.5rem;font-size:.85rem;color:#e2e8f0;border:1px solid #1e3a5f}
    a{color:#60a5fa;text-decoration:none}
    a:hover{text-decoration:underline}
    .reset-notice{background:#1e293b;border-left:4px solid #f59e0b;padding:1rem;border-radius:0 6px 6px 0;margin:1.5rem 0;color:#fbbf24}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    @media(max-width:600px){.grid{grid-template-columns:1fr}}
    .card{background:#1e293b;border:1px solid #1e3a5f;border-radius:6px;padding:1rem}
    .card h3{color:#93c5fd;font-size:1rem;margin-bottom:.5rem}
    .card ul{list-style:none;padding:0}
    .card li{padding:.2rem 0;color:#94a3b8;font-size:.9rem}
    .card li::before{content:">";color:#60a5fa;margin-right:.5rem}
  </style>
</head>
<body>
  <div class="container">
    <h1>Origami BFF Mock</h1>
    <span class="badge">SANDBOX</span>
    <p>Sandbox de demonstra&ccedil;&atilde;o para o app <strong>Origami Benef&iacute;cios</strong>. Servidor GraphQL com estado mut&aacute;vel, reset autom&aacute;tico e 12 usu&aacute;rios de teste pr&eacute;-configurados.</p>

    <div class="reset-notice">O sandbox &eacute; resetado automaticamente a cada <strong>1 hora</strong>. Todas as muta&ccedil;&otilde;es ser&atilde;o revertidas para os dados iniciais (seeds).</div>

    <h2>Endpoints</h2>
    <table>
      <tr><th>Endpoint</th><th>M&eacute;todo</th><th>Descri&ccedil;&atilde;o</th></tr>
      <tr><td><a href="/graphql">/graphql</a></td><td>POST / GET</td><td>GraphQL endpoint (Yoga GraphiQL)</td></tr>
      <tr><td><a href="/health">/health</a></td><td>GET</td><td>Health check + uptime + pr&oacute;ximo reset</td></tr>
      <tr><td><a href="/reset">/reset</a></td><td>GET</td><td>Reseta estado para dados iniciais</td></tr>
      <tr><td><a href="/status">/status</a></td><td>GET</td><td>Resumo do estado atual do sandbox</td></tr>
    </table>

    <h2>Credenciais de Teste</h2>
    <table>
      <tr><th>#</th><th>Nome</th><th>CPF</th><th>Senha</th><th>Observa&ccedil;&atilde;o</th></tr>
      <tr><td>1</td><td>Lucas Oliveira Silva</td><td><code>611.512.751-31</code></td><td><code>Origami1</code></td><td>Usu&aacute;rio principal, 8 carteiras, 3 cart&otilde;es</td></tr>
      <tr><td>2</td><td>Maria Santos Ferreira</td><td><code>722.533.250-31</code></td><td><code>Origami2!</code></td><td>Gerente RH, 3 carteiras</td></tr>
      <tr><td>3</td><td>Jo&atilde;o Pedro Costa</td><td><code>853.107.850-43</code></td><td><code>Origami3!</code></td><td>Analista Financeiro</td></tr>
      <tr><td>4</td><td>Carlos Eduardo Mendes</td><td><code>719.651.035-61</code></td><td><code>&mdash;</code></td><td>Primeiro acesso (senha null)</td></tr>
      <tr><td>5</td><td>Ana Carolina Lima</td><td><code>805.873.100-57</code></td><td><code>Origami5!</code></td><td>2 tentativas falhas</td></tr>
      <tr><td>6</td><td>Roberto Almeida</td><td><code>761.272.610-66</code></td><td><code>Origami6!</code></td><td>Bloqueio definitivo</td></tr>
      <tr><td>7</td><td>Fernanda Rocha Barbosa</td><td><code>663.923.321-54</code></td><td><code>Origami7!</code></td><td>Estagi&aacute;ria, saldo baixo</td></tr>
      <tr><td>8</td><td>Diego Nascimento Santos</td><td><code>468.819.736-59</code></td><td><code>Origami8!</code></td><td>Executivo, 7 carteiras, 4 cart&otilde;es</td></tr>
      <tr><td>9</td><td>Patr&iacute;cia Vieira Duarte</td><td><code>993.563.272-54</code></td><td><code>Origami9!</code></td><td>Bloqueio tempor&aacute;rio (4 tentativas)</td></tr>
      <tr><td>10</td><td>Thiago Martins Ribeiro</td><td><code>951.817.560-85</code></td><td><code>&mdash;</code></td><td>Primeiro acesso (senha null)</td></tr>
      <tr><td>11</td><td>Juliana Campos Neto</td><td><code>480.635.817-76</code></td><td><code>Origami11!</code></td><td>Saldo quase zerado</td></tr>
      <tr><td>12</td><td>Rafael Souza Pereira</td><td><code>839.705.232-14</code></td><td><code>Origami12!</code></td><td>Desligado, bloqueio definitivo</td></tr>
    </table>

    <h2>Opera&ccedil;&otilde;es GraphQL</h2>
    <div class="grid">
      <div class="card">
        <h3>Queries (27)</h3>
        <ul>
          <li>findByCpf, sessions, securityActivity</li>
          <li>wallets, transactions, balancesByCategory</li>
          <li>validatePixKey, nextDeposits, canPixCashOut</li>
          <li>cards, cardDelivery, revealCard</li>
          <li>notifications, notificationPreferences</li>
          <li>partners, nearbyPartners, partner, favoritePartners</li>
          <li>disputes, reimbursements, balanceRequests</li>
          <li>kycStatus, approvals, approvalsPendingCount</li>
          <li>externalBenefits, rewardsSummary</li>
          <li>productBanners, digitalWalletCards, faqs</li>
          <li>expenses, advances, expenseReports</li>
          <li>availableVouchers, myVouchers, geofenceZones</li>
        </ul>
      </div>
      <div class="card">
        <h3>Mutations (45)</h3>
        <ul>
          <li>login, logout, forgotPassword, verifyOtp</li>
          <li>resetPassword, updatePassword, validateCode</li>
          <li>pixTransfer, processQrPayment, payBoleto</li>
          <li>mobileRecharge, reallocateBenefit, cashOut</li>
          <li>blockCard, unblockCard, createVirtualCard</li>
          <li>activateCard, changeCardPin, requestCardReplacement</li>
          <li>markNotificationRead, markAllNotificationsRead</li>
          <li>toggleFavoritePartner</li>
          <li>submitDispute, submitReimbursement</li>
          <li>createBalanceRequest, updateBalanceRequest</li>
          <li>addToGooglePay, addToSamsungPay</li>
          <li>approveAction, rejectAction</li>
          <li>createExpense, deleteExpense</li>
          <li>createAdvance, createExpenseReport</li>
          <li>buyVoucher, addGeofenceZone</li>
          <li>redeemReward, activateBenefit</li>
          <li>ocrReceipt, submitFeedback</li>
        </ul>
      </div>
    </div>

    <h2>Exemplos</h2>
    <p>Login com usu&aacute;rio 1:</p>
    <pre>curl -X POST ${BASE}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query":"mutation { login(input: { cpf: \\"61151275131\\", senha: \\"Origami1\\" }) { accessToken refreshToken expiresIn } }"}'</pre>

    <p>Listar carteiras (autenticado):</p>
    <pre>curl -X POST ${BASE}/graphql \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer origami-mock-1" \\
  -d '{"query":"{ wallets { id nome tipo saldo } }"}'</pre>

    <p>Resetar sandbox:</p>
    <pre>curl ${BASE}/reset</pre>
  </div>
</body>
</html>`
}

const server = createServer((req, res) => {
  // ─── CORS preflight ─────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-App-Version, X-Platform, X-API-Version',
    })
    res.end()
    return
  }

  // ─── Landing page ───────────────────────────────────────────────
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
    res.end(landingPage())
    return
  }

  // ─── Reset endpoint ────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/reset') {
    reset()
    lastResetAt = Date.now()
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({ success: true, message: 'State reset to seed data' }))
    return
  }

  // ─── Health endpoint ───────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/health') {
    const uptimeMs = Date.now() - startedAt
    const uptimeSec = Math.floor(uptimeMs / 1000)
    const h = Math.floor(uptimeSec / 3600)
    const m = Math.floor((uptimeSec % 3600) / 60)
    const s = uptimeSec % 60
    const nextResetMs = RESET_INTERVAL_MS - (Date.now() - lastResetAt)
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({
      status: 'ok',
      sandbox: true,
      uptime: `${h}h ${m}m ${s}s`,
      uptimeMs,
      startedAt: new Date(startedAt).toISOString(),
      autoResetInterval: '1h',
      nextResetIn: `${Math.floor(nextResetMs / 60000)}m ${Math.floor((nextResetMs % 60000) / 1000)}s`,
      nextResetAt: new Date(lastResetAt + RESET_INTERVAL_MS).toISOString(),
    }))
    return
  }

  // ─── Status endpoint ──────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/status') {
    const nextResetAt = new Date(lastResetAt + RESET_INTERVAL_MS).toISOString()
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({
      sandbox: true,
      autoResetInterval: '1h',
      nextReset: nextResetAt,
      uptime: formatUptime(),
      state: getStateSummary(),
      mutations: getMutationStats(),
    }))
    return
  }

  // ─── GraphQL ────────────────────────────────────────────────────
  yoga(req, res)
})

server.listen(PORT, '0.0.0.0', () => {
  const ts = new Date().toISOString().slice(0, 19)
  console.log(`
+======================================================+
|  Origami BFF Mock - Demo Sandbox       ${ts}  |
|  http://0.0.0.0:${PORT}/graphql                        |
|  GET /        -> landing page                        |
|  GET /reset   -> reset state to seeds                |
|  GET /health  -> server health check                 |
|  GET /status  -> state summary                       |
|  Auto-reset every 60 minutes                         |
+======================================================+
Format: [HH:MM:SS.mmm] TYPE     OperationName                     | user:N
`)
})
