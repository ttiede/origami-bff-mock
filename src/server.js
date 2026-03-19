import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'
import { reset } from './state.js'

const startedAt = Date.now()

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
        console.log(`[${ts}] ${opType.toUpperCase().padEnd(8)} ${opName.padEnd(35)} | ${userId}`)
      },
      onExecuteDone({ result }) {
        if (result?.errors?.length) {
          result.errors.forEach(e => {
            console.error(`           ERROR: ${e.message}`)
          })
        }
      },
    },
  ],
})

const PORT = parseInt(process.env.PORT ?? '8080', 10)

const server = createServer((req, res) => {
  // ─── REST endpoints ─────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/reset') {
    reset()
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({ success: true, message: 'State reset to seed data' }))
    return
  }

  if (req.method === 'GET' && req.url === '/health') {
    const uptimeMs = Date.now() - startedAt
    const uptimeSec = Math.floor(uptimeMs / 1000)
    const h = Math.floor(uptimeSec / 3600)
    const m = Math.floor((uptimeSec % 3600) / 60)
    const s = uptimeSec % 60
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({
      status: 'ok',
      uptime: `${h}h ${m}m ${s}s`,
      uptimeMs,
      startedAt: new Date(startedAt).toISOString(),
    }))
    return
  }

  // ─── GraphQL ────────────────────────────────────────────────────
  yoga(req, res)
})

server.listen(PORT, '0.0.0.0', () => {
  const ts = new Date().toISOString().slice(0, 19)
  console.log(`
╔══════════════════════════════════════════════════════╗
║  Origami BFF Mock — Dynamic Sandbox      ${ts}  ║
║  http://0.0.0.0:${PORT}/graphql                        ║
║  GET /reset  → reset state to seeds                  ║
║  GET /health → server health check                   ║
╚══════════════════════════════════════════════════════╝
Format: [HH:MM:SS.mmm] TYPE     OperationName                     | user:N
`)
})
