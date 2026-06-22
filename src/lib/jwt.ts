import { jwtVerify } from 'jose'

// Nombre de la cookie httpOnly donde guardamos el JWT. Vive aquí (no en
// session.ts) porque session.ts importa next/headers, que no es edge-safe y el
// middleware/proxy necesita este nombre sin arrastrar esa dependencia.
export const TOKEN_COOKIE = 'token'

// Roles del dominio (espejo del enum del back). Antes venía de @prisma/client;
// ahora el front no depende de Prisma para la sesión.
export type UserRole = 'owner' | 'manager' | 'employee'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: UserRole
  branchId: string | null
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

// Verifica firma + expiración del JWT emitido por el back, usando el MISMO
// secreto (HS256). jose corre tanto en Node como en Edge → lo usan getSession()
// y el proxy/middleware. Devuelve null si el token es inválido o expiró.
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      id: payload.sub as string,
      name: (payload.name as string) ?? '',
      email: (payload.email as string) ?? '',
      role: payload.role as UserRole,
      branchId: (payload.branchId as string | null) ?? null,
    }
  } catch {
    return null
  }
}
