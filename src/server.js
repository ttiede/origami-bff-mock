import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'

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
const server = createServer(yoga)

server.listen(PORT, '0.0.0.0', () => {
  const ts = new Date().toISOString().slice(0, 19)
  console.log(`
╔══════════════════════════════════════════════════════╗
║  Origami BFF Mock — graphql-yoga          ${ts}  ║
║  http://0.0.0.0:${PORT}/graphql                        ║
╚══════════════════════════════════════════════════════╝
Format: [HH:MM:SS.mmm] TYPE     OperationName                     | user:N
`)
})
