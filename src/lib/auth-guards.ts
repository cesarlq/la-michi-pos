import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import type { UserRole } from '@/lib/jwt'

// Requiere SOLO sesión (cualquier rol). Devuelve el usuario ya verificado.
// Úsalo en páginas/actions: `const user = await requireAuth()`.
export async function requireAuth() {
  const user = await getSession()
  if (!user) redirect('/login')
  return user
}

// Requiere sesión Y que el rol esté entre los permitidos. Si no, redirige a "/".
// Ej: `const user = await requireRole('owner')` o `requireRole('owner', 'manager')`.
export async function requireRole(...roles: UserRole[]) {
  const user = await requireAuth()
  if (roles.length > 0 && !roles.includes(user.role)) redirect('/')
  return user
}
