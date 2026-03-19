/**
 * Utilitários de token mock.
 *
 * O token tem formato: origami-mock-{userId}
 * Ex: "origami-mock-1" para Lucas Oliveira Silva (userId=1)
 *
 * Não é um JWT real — é apenas um identificador de sessão mock.
 * O app armazena e envia como Bearer token em todas as requests.
 */

export function makeToken(userId) {
  return `origami-mock-${userId}`
}

/**
 * Extrai o userId do Bearer token.
 * Retorna '1' (Lucas) como fallback se o token não for reconhecido.
 */
export function getUserIdFromRequest(request) {
  const auth = request.headers.get('authorization') ?? ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  const match = token.match(/^origami-mock-(\d+)$/)
  return match ? match[1] : '1'
}
