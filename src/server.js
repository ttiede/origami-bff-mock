import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'
import { reset, getStateSummary, getMutationStats, setFailureMode, getFailureMode } from './state.js'
import { logRequest, getLogs, clearLogs, getLogStats, getActiveScenarios, setScenario, clearScenarios, getScenario, TEST_SCENARIOS } from './request_logger.js'

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
      onResultProcess({ request, result }) {
        try {
          const auth = request?.headers?.get?.('authorization') ?? '-'
          const userId = auth.startsWith('Bearer origami-mock-')
            ? auth.replace('Bearer origami-mock-', '').split('-')[0]
            : auth !== '-' ? 'jwt' : 'anon'
          const scenario = request?.headers?.get?.('x-test-scenario') ?? null

          // Extract operation info from result
          const data = result?.data ?? {}
          const errors = result?.errors ?? []
          const opKeys = Object.keys(data)
          const opName = opKeys[0] ?? '(anonymous)'
          const opType = errors.length > 0 && !data[opKeys[0]] ? 'mutation' : 'query'
          const hasErrors = errors.length > 0

          const responseSummary = opKeys.map(k => {
            const v = data[k]
            if (v === null) return `${k}=null`
            if (Array.isArray(v)) return `${k}=[${v.length}]`
            if (typeof v === 'object') return `${k}={ok}`
            return `${k}=${String(v).slice(0, 50)}`
          }).join(', ')

          const ts = new Date().toISOString().slice(11, 23)
          console.log(`[${ts}] ${opType.toUpperCase().padEnd(8)} ${opName.padEnd(35)} | user:${userId}${scenario ? ` sc:${scenario}` : ''} → ${responseSummary}`)

          if (hasErrors) {
            errors.forEach(e => console.error(`[${ts}] ERROR    ${e.message}`))
          }

          // Log to ring buffer
          logRequest({
            operation: opName,
            type: opType,
            userId,
            scenario,
            status: hasErrors ? 'error' : 'ok',
            durationMs: 0,
            response: responseSummary,
            errors: hasErrors ? errors.map(e => ({
              message: e.message,
              code: e.extensions?.code,
              httpStatus: e.extensions?.http?.status,
            })) : [],
          })
        } catch (e) {
          console.error('[logger] Error:', e.message)
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

// ─── Swagger JSON builder (auto-generated from schema) ─────────────────────
function buildSwaggerJson() {
  // Parse typeDefs to extract queries, mutations, types
  const lines = typeDefs.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  const queries = [], mutations = [], types = []
  let section = null, currentType = null

  for (const line of lines) {
    if (line.startsWith('type Query')) { section = 'query'; continue }
    if (line.startsWith('type Mutation')) { section = 'mutation'; continue }
    if (line.match(/^(type|input)\s+\w+/)) {
      const m = line.match(/^(type|input)\s+(\w+)/)
      if (m) { currentType = { kind: m[1], name: m[2], fields: [] }; types.push(currentType) }
      section = 'type'
      continue
    }
    if (line === '}') { section = null; currentType = null; continue }

    if (section === 'query' && line.includes(':')) {
      const m = line.match(/^(\w+)(\([^)]*\))?\s*:\s*(.+)/)
      if (m) queries.push({ name: m[1], args: m[2] || '', returnType: m[3].replace(/[![\]]/g, '').trim() })
    }
    if (section === 'mutation' && line.includes(':')) {
      const m = line.match(/^(\w+)(\([^)]*\))?\s*:\s*(.+)/)
      if (m) mutations.push({ name: m[1], args: m[2] || '', returnType: m[3].replace(/[![\]]/g, '').trim() })
    }
    if (section === 'type' && currentType && line.includes(':')) {
      const m = line.match(/^(\w+)\s*:\s*(.+)/)
      if (m) currentType.fields.push({ name: m[1], type: m[2].replace(/[![\]]/g, '').trim() })
    }
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'Origami BFF Mock — GraphQL API',
      version: '2.0.0',
      description: 'Sandbox de demonstração para o app Origami Benefícios. Todas as operações são GraphQL mas documentadas aqui em formato OpenAPI para referência do time de backend.',
      contact: { name: 'Time Origami', url: 'https://github.com/ttiede/origami-bff-mock' },
    },
    servers: [
      { url: process.env.RENDER_EXTERNAL_URL || 'https://origami-bff-mock.onrender.com', description: 'Sandbox (Render)' },
      { url: 'http://localhost:8080', description: 'Local development' },
    ],
    queries: queries.map(q => ({
      operation: q.name,
      type: 'query',
      arguments: q.args,
      returns: q.returnType,
      errorCodes: ['401 Unauthorized', '404 Not Found'],
    })),
    mutations: mutations.map(m => ({
      operation: m.name,
      type: 'mutation',
      arguments: m.args,
      returns: m.returnType,
      errorCodes: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found', '409 Conflict', '422 Unprocessable', '429 Rate Limited'],
    })),
    types: types.map(t => ({
      kind: t.kind,
      name: t.name,
      fields: t.fields,
    })),
    endpoints: {
      graphql: { method: 'POST', path: '/graphql', description: 'GraphQL endpoint (queries & mutations)' },
      graphiql: { method: 'GET', path: '/graphql', description: 'GraphiQL interactive IDE' },
      health: { method: 'GET', path: '/health', description: 'Health check + uptime' },
      reset: { method: 'GET', path: '/reset', description: 'Reset sandbox state' },
      status: { method: 'GET', path: '/status', description: 'State summary' },
      swagger: { method: 'GET', path: '/swagger', description: 'This documentation' },
      swaggerJson: { method: 'GET', path: '/swagger.json', description: 'Machine-readable API spec' },
      simulateFailures: { method: 'GET', path: '/simulate-failures?rate=0.1', description: 'Enable failure simulation' },
    },
    authentication: {
      type: 'Bearer Token',
      description: 'Login returns a JWT-like token. Pass it as Authorization: Bearer <token> on all mutations.',
      testCredentials: [
        { cpf: '611.512.751-31', password: 'Origami1', name: 'Lucas (principal)' },
        { cpf: '722.533.250-31', password: 'Origami2!', name: 'Maria (gerente)' },
        { cpf: '853.107.850-43', password: 'Origami3!', name: 'João (analista)' },
      ],
    },
    errorHandling: {
      description: 'All mutations return GraphQL errors with HTTP status codes in extensions',
      families: {
        '200': 'Success',
        '400': 'Bad Request — missing or invalid fields',
        '401': 'Unauthorized — missing/invalid Bearer token or wrong credentials',
        '403': 'Forbidden — blocked user or insufficient permissions',
        '404': 'Not Found — resource does not exist',
        '409': 'Conflict — resource already in requested state or overlap',
        '422': 'Unprocessable — business rule violation (insufficient balance, weak PIN, limit exceeded)',
        '429': 'Rate Limited — too many failed attempts (5 failures → 15min lockout)',
        '500': 'Server Error — via /simulate-failures endpoint',
      },
    },
  }
}

// ─── Swagger HTML page ─────────────────────────────────────────────────────
function swaggerPage() {
  const spec = buildSwaggerJson()
  const BASE = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`

  const queryRows = spec.queries.map(q =>
    `<tr><td><code class="query">${q.operation}</code></td><td><code>${q.arguments || '—'}</code></td><td><code>${q.returns}</code></td><td>query</td></tr>`
  ).join('\n')

  const mutationRows = spec.mutations.map(m =>
    `<tr><td><code class="mutation">${m.operation}</code></td><td><code>${m.arguments || '—'}</code></td><td><code>${m.returns}</code></td><td>mutation</td></tr>`
  ).join('\n')

  const typeBlocks = spec.types.map(t => {
    const fields = t.fields.map(f => `  <span class="field">${f.name}</span>: <span class="type">${f.type}</span>`).join('\n')
    return `<div class="type-block"><div class="type-header">${t.kind} <strong>${t.name}</strong></div><pre>${fields}</pre></div>`
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Origami BFF Mock — API Docs</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f1729;color:#e2e8f0;line-height:1.6;padding:2rem}
    .container{max-width:1100px;margin:0 auto}
    h1{font-size:2rem;color:#60a5fa;margin-bottom:.5rem}
    h2{font-size:1.4rem;color:#93c5fd;margin:2.5rem 0 1rem;border-bottom:1px solid #1e3a5f;padding-bottom:.5rem}
    h3{font-size:1.1rem;color:#a5b4fc;margin:1.5rem 0 .5rem}
    p{color:#94a3b8;margin-bottom:1rem}
    .badge{display:inline-block;background:#1e3a5f;color:#60a5fa;padding:.2rem .6rem;border-radius:4px;font-size:.8rem;margin-right:.5rem}
    .badge.green{background:#064e3b;color:#6ee7b7}
    .badge.red{background:#7f1d1d;color:#fca5a5}
    .badge.yellow{background:#713f12;color:#fde68a}
    table{width:100%;border-collapse:collapse;margin-bottom:1.5rem;font-size:.88rem}
    th{background:#1e293b;color:#93c5fd;text-align:left;padding:.6rem .8rem;border:1px solid #1e3a5f;position:sticky;top:0}
    td{padding:.5rem .8rem;border:1px solid #1e3a5f;vertical-align:top}
    tr:nth-child(even){background:#1a2332}
    code{background:#1e293b;padding:.15rem .4rem;border-radius:3px;font-size:.82rem;color:#f472b6}
    code.query{color:#6ee7b7}
    code.mutation{color:#fbbf24}
    pre{background:#1e293b;padding:1rem;border-radius:6px;overflow-x:auto;margin-bottom:1rem;font-size:.82rem;color:#e2e8f0;border:1px solid #1e3a5f;white-space:pre-wrap}
    a{color:#60a5fa;text-decoration:none}a:hover{text-decoration:underline}
    .error-table td:first-child{font-weight:bold;width:80px}
    .type-block{background:#1e293b;border:1px solid #1e3a5f;border-radius:6px;padding:1rem;margin-bottom:1rem}
    .type-header{color:#a5b4fc;font-size:.9rem;margin-bottom:.5rem}
    .field{color:#6ee7b7}.type{color:#f472b6}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    @media(max-width:768px){.grid{grid-template-columns:1fr}}
    .nav{background:#1e293b;padding:1rem;border-radius:6px;margin-bottom:2rem;display:flex;gap:1rem;flex-wrap:wrap}
    .nav a{background:#1e3a5f;padding:.4rem .8rem;border-radius:4px;font-size:.85rem}
    .example{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:1rem;margin:.5rem 0 1rem;font-size:.82rem;color:#c9d1d9}
    .copy-btn{background:#238636;color:white;border:none;padding:.3rem .6rem;border-radius:4px;cursor:pointer;font-size:.75rem;float:right}
    .copy-btn:hover{background:#2ea043}
    .section-count{color:#60a5fa;font-size:.85rem;font-weight:normal}
    .tabs{display:flex;gap:.5rem;margin-bottom:1rem}
    .tab{background:#1e293b;border:1px solid #1e3a5f;padding:.4rem .8rem;border-radius:4px 4px 0 0;cursor:pointer;font-size:.85rem;color:#94a3b8}
    .tab.active{background:#1e3a5f;color:#60a5fa;border-bottom-color:#1e3a5f}
  </style>
</head>
<body>
<div class="container">
  <h1>Origami BFF Mock &mdash; API Documentation</h1>
  <p><span class="badge">GraphQL</span><span class="badge green">Sandbox</span> <span class="badge">v2.0.0</span></p>
  <p>Documenta&ccedil;&atilde;o completa de todas as opera&ccedil;&otilde;es GraphQL dispon&iacute;veis no mock server. Use esta p&aacute;gina como refer&ecirc;ncia para implementar o backend real.</p>

  <div class="nav">
    <a href="#endpoints">Endpoints</a>
    <a href="#auth">Autentica&ccedil;&atilde;o</a>
    <a href="#queries">Queries (${spec.queries.length})</a>
    <a href="#mutations">Mutations (${spec.mutations.length})</a>
    <a href="#types">Types (${spec.types.length})</a>
    <a href="#errors">Error Handling</a>
    <a href="#examples">Exemplos</a>
    <a href="${BASE}/graphql">GraphiQL IDE</a>
    <a href="${BASE}/swagger.json">swagger.json</a>
  </div>

  <h2 id="endpoints">Endpoints</h2>
  <table>
    <tr><th>Endpoint</th><th>M&eacute;todo</th><th>Descri&ccedil;&atilde;o</th></tr>
    <tr><td><a href="${BASE}/graphql"><code>/graphql</code></a></td><td>POST / GET</td><td>GraphQL endpoint + GraphiQL IDE</td></tr>
    <tr><td><a href="${BASE}/health"><code>/health</code></a></td><td>GET</td><td>Health check + uptime + pr&oacute;ximo reset</td></tr>
    <tr><td><a href="${BASE}/reset"><code>/reset</code></a></td><td>GET</td><td>Reset sandbox para dados iniciais</td></tr>
    <tr><td><a href="${BASE}/status"><code>/status</code></a></td><td>GET</td><td>Resumo do estado atual</td></tr>
    <tr><td><a href="${BASE}/swagger"><code>/swagger</code></a></td><td>GET</td><td>Esta documenta&ccedil;&atilde;o</td></tr>
    <tr><td><a href="${BASE}/swagger.json"><code>/swagger.json</code></a></td><td>GET</td><td>Spec JSON (machine-readable)</td></tr>
    <tr><td><code>/simulate-failures?rate=0.1</code></td><td>GET</td><td>Simular falhas (rate 0-1)</td></tr>
    <tr><td><code>/simulate-failures?off</code></td><td>GET</td><td>Desligar simula&ccedil;&atilde;o de falhas</td></tr>
  </table>

  <h2 id="auth">Autentica&ccedil;&atilde;o</h2>
  <p>Todas as <strong>mutations</strong> exigem <code>Authorization: Bearer &lt;token&gt;</code>. O token &eacute; retornado pelo <code>login</code> mutation.</p>
  <h3>Como autenticar</h3>
  <div class="example"><pre>{
  "query": "mutation { login(input: { cpf: \\"61151275131\\", password: \\"Origami1\\" }) { token user { id nome } } }"
}</pre></div>
  <p>Use o <code>token</code> retornado como header:</p>
  <div class="example"><pre>Authorization: Bearer mock-jwt-lucas-1...</pre></div>

  <h3>Credenciais de teste</h3>
  <table>
    <tr><th>Nome</th><th>CPF</th><th>Senha</th><th>Perfil</th></tr>
    <tr><td>Lucas Oliveira</td><td><code>61151275131</code></td><td><code>Origami1</code></td><td>Principal &mdash; 8 carteiras, 3 cart&otilde;es</td></tr>
    <tr><td>Maria Santos</td><td><code>72253325031</code></td><td><code>Origami2!</code></td><td>Gerente RH</td></tr>
    <tr><td>Jo&atilde;o Pedro</td><td><code>85310785043</code></td><td><code>Origami3!</code></td><td>Analista Financeiro</td></tr>
    <tr><td>Carlos Eduardo</td><td><code>71965103561</code></td><td>&mdash;</td><td>Primeiro acesso (sem senha)</td></tr>
    <tr><td>Roberto Almeida</td><td><code>76127261066</code></td><td><code>Origami6!</code></td><td>Bloqueio definitivo (403)</td></tr>
    <tr><td>Patr&iacute;cia Vieira</td><td><code>99356327254</code></td><td><code>Origami9!</code></td><td>Bloqueio tempor&aacute;rio (4 tentativas)</td></tr>
  </table>

  <h2 id="queries">Queries <span class="section-count">(${spec.queries.length})</span></h2>
  <table>
    <tr><th>Opera&ccedil;&atilde;o</th><th>Argumentos</th><th>Retorno</th><th>Tipo</th></tr>
    ${queryRows}
  </table>

  <h2 id="mutations">Mutations <span class="section-count">(${spec.mutations.length})</span></h2>
  <table>
    <tr><th>Opera&ccedil;&atilde;o</th><th>Argumentos</th><th>Retorno</th><th>Tipo</th></tr>
    ${mutationRows}
  </table>

  <h2 id="types">Types & Inputs <span class="section-count">(${spec.types.length})</span></h2>
  <div class="grid">
    ${typeBlocks}
  </div>

  <h2 id="errors">Error Handling</h2>
  <p>Todas as mutations retornam <code>GraphQLError</code> com c&oacute;digos HTTP nas <code>extensions</code>:</p>
  <table class="error-table">
    <tr><th>C&oacute;digo</th><th>Significado</th><th>Quando acontece</th></tr>
    <tr><td><span class="badge green">200</span></td><td>Success</td><td>Opera&ccedil;&atilde;o completada com sucesso</td></tr>
    <tr><td><span class="badge yellow">400</span></td><td>Bad Request</td><td>Campos obrigat&oacute;rios ausentes ou inv&aacute;lidos (ex: amount &lt;= 0)</td></tr>
    <tr><td><span class="badge red">401</span></td><td>Unauthorized</td><td>Token ausente/inv&aacute;lido ou credenciais incorretas</td></tr>
    <tr><td><span class="badge red">403</span></td><td>Forbidden</td><td>Usu&aacute;rio bloqueado ou sem permiss&atilde;o</td></tr>
    <tr><td><span class="badge yellow">404</span></td><td>Not Found</td><td>Recurso n&atilde;o encontrado (carteira, cart&atilde;o, empr&eacute;stimo, etc.)</td></tr>
    <tr><td><span class="badge yellow">409</span></td><td>Conflict</td><td>Recurso j&aacute; no estado solicitado (cart&atilde;o j&aacute; bloqueado, f&eacute;rias sobrepostas)</td></tr>
    <tr><td><span class="badge red">422</span></td><td>Unprocessable</td><td>Regra de neg&oacute;cio violada (saldo insuficiente, PIN fraco, limite excedido)</td></tr>
    <tr><td><span class="badge red">429</span></td><td>Rate Limited</td><td>5 tentativas falhas &rarr; bloqueio de 15 minutos (login, OTP, PIN)</td></tr>
    <tr><td><span class="badge red">500</span></td><td>Server Error</td><td>Via <code>/simulate-failures?rate=0.1</code></td></tr>
  </table>

  <h2 id="examples">Exemplos de Consumo</h2>

  <h3>1. Login</h3>
  <div class="example"><pre>curl -X POST ${BASE}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query": "mutation { login(input: { cpf: \\"61151275131\\", password: \\"Origami1\\" }) { token user { id nome email } } }"}'</pre></div>

  <h3>2. Buscar carteiras (autenticado)</h3>
  <div class="example"><pre>curl -X POST ${BASE}/graphql \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN" \\
  -d '{"query": "{ wallets { id nome saldo categoria limite } }"}'</pre></div>

  <h3>3. Transfer&ecirc;ncia PIX</h3>
  <div class="example"><pre>curl -X POST ${BASE}/graphql \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN" \\
  -d '{"query": "mutation { pixTransfer(walletId: \\"w1\\", amount: 50.0, pixKey: \\"email@exemplo.com\\", pixKeyType: \\"EMAIL\\", description: \\"Teste\\") { id valor status } }"}'</pre></div>

  <h3>4. Tratar erro (saldo insuficiente)</h3>
  <div class="example"><pre>// Resposta com erro 422:
{
  "errors": [{
    "message": "Saldo insuficiente na carteira w1",
    "extensions": {
      "code": "INSUFFICIENT_BALANCE",
      "http": { "status": 422 }
    }
  }]
}</pre></div>

  <h3>5. Rate limiting (login)</h3>
  <div class="example"><pre>// Ap&oacute;s 5 tentativas falhas:
{
  "errors": [{
    "message": "Muitas tentativas. Tente novamente em 15 minutos.",
    "extensions": {
      "code": "RATE_LIMITED",
      "http": { "status": 429 }
    }
  }]
}</pre></div>

  <h3>6. Bater ponto (HR)</h3>
  <div class="example"><pre>curl -X POST ${BASE}/graphql \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN" \\
  -d '{"query": "mutation { clockIn(latitude: -23.5505, longitude: -46.6333) { id timestamp type approved } }"}'</pre></div>

  <h3>7. Simular cr&eacute;dito</h3>
  <div class="example"><pre>curl -X POST ${BASE}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ creditSimulation(amount: 10000, installments: 24, type: \\"consignado\\") { monthlyPayment interestRate totalCost iofTax } }"}'</pre></div>

  <p style="margin-top:3rem;color:#475569;text-align:center;font-size:.8rem">
    Gerado automaticamente a partir do schema GraphQL &mdash; <a href="${BASE}/swagger.json">swagger.json</a> &mdash;
    Atualizado em ${new Date().toISOString().slice(0, 10)}
  </p>
</div>
</body>
</html>`
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
      <tr><td><a href="/simulate-failures?rate=0.1">/simulate-failures?rate=N</a></td><td>GET</td><td>Habilita falhas simuladas (rate 0-1)</td></tr>
      <tr><td><a href="/simulate-failures?off">/simulate-failures?off</a></td><td>GET</td><td>Desabilita falhas simuladas</td></tr>
      <tr><td><a href="/logs">/logs</a></td><td>GET</td><td>Ring buffer das &uacute;ltimas 500 requests (filtros: operation, type, user, status)</td></tr>
      <tr><td><a href="/logs?stats">/logs?stats</a></td><td>GET</td><td>Estat&iacute;sticas de requests (top operations, users, errors)</td></tr>
      <tr><td><a href="/logs?clear">/logs?clear</a></td><td>GET</td><td>Limpa o buffer de logs</td></tr>
      <tr><td><a href="/scenarios?list">/scenarios?list</a></td><td>GET</td><td>Lista cen&aacute;rios dispon&iacute;veis e ativos</td></tr>
      <tr><td><a href="/scenarios?set=pix_insufficient_balance">/scenarios?set=NAME</a></td><td>GET</td><td>Ativa um cen&aacute;rio de teste</td></tr>
      <tr><td><a href="/scenarios?clear">/scenarios?clear</a></td><td>GET</td><td>Desativa todos os cen&aacute;rios</td></tr>
      <tr><td><a href="/profiles">/profiles</a></td><td>GET</td><td>Lista todos os perfis de teste e jornadas mapeadas</td></tr>
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
    clearLogs()
    clearScenarios()
    lastResetAt = Date.now()
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({ success: true, message: 'State + logs + scenarios reset to seed data' }))
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

  // ─── Simulate failures endpoint ────────────────────────────────
  if (req.method === 'GET' && req.url?.startsWith('/simulate-failures')) {
    const url = new URL(req.url, `http://localhost:${PORT}`)
    if (url.searchParams.has('off')) {
      setFailureMode(false)
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify({ success: true, failureMode: getFailureMode() }))
    } else {
      const rate = parseFloat(url.searchParams.get('rate') ?? '0.1')
      setFailureMode(true, Math.max(0, Math.min(1, rate)))
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify({ success: true, failureMode: getFailureMode() }))
    }
    return
  }

  // ─── Logs endpoint (ring buffer — last 500 requests) ───────────
  if (req.method === 'GET' && req.url?.startsWith('/logs')) {
    const url = new URL(req.url, `http://localhost:${PORT}`)
    const limit = parseInt(url.searchParams.get('limit') ?? '50')
    const offset = parseInt(url.searchParams.get('offset') ?? '0')
    const operation = url.searchParams.get('operation') ?? undefined
    const type = url.searchParams.get('type') ?? undefined
    const user = url.searchParams.get('user') ?? undefined
    const status = url.searchParams.get('status') ?? undefined

    if (url.searchParams.has('clear')) {
      clearLogs()
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify({ success: true, message: 'Logs cleared' }))
      return
    }

    if (url.searchParams.has('stats')) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify(getLogStats()))
      return
    }

    const result = getLogs({ limit, offset, operation, type, user, status })
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify(result))
    return
  }

  // ─── Scenarios endpoint (control mock behavior) ────────────────
  if (req.method === 'GET' && req.url?.startsWith('/scenarios')) {
    const url = new URL(req.url, `http://localhost:${PORT}`)

    if (url.searchParams.has('clear')) {
      clearScenarios()
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify({ success: true, message: 'All scenarios cleared' }))
      return
    }

    if (url.searchParams.has('set')) {
      const key = url.searchParams.get('set')
      const scenario = TEST_SCENARIOS[key]
      if (!scenario) {
        res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ error: `Unknown scenario: ${key}`, available: Object.keys(TEST_SCENARIOS) }))
        return
      }
      setScenario(key, scenario)
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify({ success: true, scenario: key, config: scenario }))
      return
    }

    if (url.searchParams.has('list')) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify({ available: TEST_SCENARIOS, active: getActiveScenarios() }))
      return
    }

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({ active: getActiveScenarios() }))
    return
  }

  // ─── Profiles endpoint (list all test users) ──────────────────
  if (req.method === 'GET' && req.url === '/profiles') {
    const users = getStateSummary()
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({
      profiles: [
        { id: 1, name: 'Lucas Oliveira', cpf: '61151275131', password: 'Origami1', role: 'Principal (8 wallets, 3+ cards)', token: 'origami-mock-1' },
        { id: 2, name: 'Maria Santos', cpf: '72253325031', password: 'Origami2!', role: 'Gerente RH', token: 'origami-mock-2' },
        { id: 3, name: 'João Pedro', cpf: '85310785043', password: 'Origami3!', role: 'Analista Financeiro', token: 'origami-mock-3' },
        { id: 4, name: 'Carlos Eduardo', cpf: '71965103561', password: null, role: 'Primeiro acesso (sem senha)', token: 'origami-mock-4-first-access' },
        { id: 5, name: 'Ana Carolina', cpf: '80587310057', password: 'Origami5!', role: '2 tentativas falhas', token: 'origami-mock-5' },
        { id: 6, name: 'Roberto Almeida', cpf: '76127261066', password: 'Origami6!', role: 'Bloqueio definitivo (403)', token: null },
        { id: 7, name: 'Fernanda Rocha', cpf: '66392332154', password: 'Origami7!', role: 'Estagiária (saldo baixo)', token: 'origami-mock-7' },
        { id: 8, name: 'Diego Nascimento', cpf: '46881973659', password: 'Origami8!', role: 'Executivo (7 wallets, 4 cards)', token: 'origami-mock-8' },
        { id: 9, name: 'Patrícia Vieira', cpf: '99356327254', password: 'Origami9!', role: 'Bloqueio temporário (4 tentativas)', token: 'origami-mock-9' },
        { id: 10, name: 'Thiago Martins', cpf: '95181756085', password: null, role: 'Primeiro acesso (sem senha)', token: 'origami-mock-10-first-access' },
        { id: 11, name: 'Juliana Campos', cpf: '48063581776', password: 'Origami11!', role: 'Saldo quase zerado', token: 'origami-mock-11' },
        { id: 12, name: 'Rafael Souza', cpf: '83970523214', password: 'Origami12!', role: 'Desligado (403)', token: null },
      ],
      journeys: {
        'login_success': { profiles: [1,2,3,5,7,8,9,11], description: 'Login com sucesso' },
        'login_blocked': { profiles: [6,12], description: 'Login bloqueado (403)' },
        'first_access': { profiles: [4,10], description: 'Primeiro acesso (sem senha)' },
        'pix_transfer': { profiles: [1,2,3,8], description: 'PIX transfer com saldo' },
        'pix_no_balance': { profiles: [7,11], description: 'PIX com saldo insuficiente (422)' },
        'card_management': { profiles: [1,8], description: 'Gerenciar cartões (bloquear/desbloquear/PIN)' },
        'hr_clock_in': { profiles: [1,2,3,7,8], description: 'Bater ponto' },
        'credit_simulation': { profiles: [1,2,3,8], description: 'Simular crédito consignado' },
        'travel_management': { profiles: [1,2,3,8], description: 'Gerenciar viagens' },
        'approvals': { profiles: [2], description: 'Aprovar/rejeitar solicitações (gerente)' },
        'full_journey': { profiles: [1], description: 'Jornada completa (todas as features)' },
      },
    }))
    return
  }

  // ─── Swagger / API Docs endpoint ───────────────────────────────
  if (req.method === 'GET' && (req.url === '/swagger' || req.url === '/docs' || req.url === '/api-docs')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
    res.end(swaggerPage())
    return
  }

  // ─── Swagger JSON (machine-readable) ─────────────────────────
  if (req.method === 'GET' && req.url === '/swagger.json') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify(buildSwaggerJson(), null, 2))
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
|  GET /simulate-failures -> toggle failure sim        |
|  Auto-reset every 60 minutes                         |
+======================================================+
Format: [HH:MM:SS.mmm] TYPE     OperationName                     | user:N
`)
})
