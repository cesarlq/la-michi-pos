import { cookies } from 'next/headers'
import { verifyToken, TOKEN_COOKIE, type SessionUser } from '@/lib/jwt'

// Re-export por conveniencia (el nombre de la cookie vive en jwt.ts, edge-safe).
export { TOKEN_COOKIE }

// Lee la cookie httpOnly y devuelve el usuario verificado (o null si no hay
// sesión / el token es inválido). Lo usan los Server Components y los guards.
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(TOKEN_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

// Devuelve el JWT crudo para reenviarlo como `Authorization: Bearer` al API
// (lo usará el cliente de API cuando rewireemos products/sales).
export async function getToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(TOKEN_COOKIE)?.value ?? null
}
