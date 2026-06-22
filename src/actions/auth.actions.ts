'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { TOKEN_COOKIE } from '@/lib/session'

// Server Action: corre EN EL SERVIDOR. Recibe las credenciales, las manda al
// backend (/auth/login) y, si son válidas, guarda el JWT en una cookie httpOnly.
// Antes esto lo hacía NextAuth contra Prisma; ahora el back es el dueño del auth.
export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let res: Response
  try {
    res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })
  } catch {
    return 'No se pudo conectar con el servidor. Intenta de nuevo.'
  }

  if (res.status === 401) return 'Correo o contraseña incorrectos.'
  if (!res.ok) return 'Algo salió mal. Intenta de nuevo.'

  const data = (await res.json()) as { accessToken: string }

  // Cookie httpOnly → el JWT NO es accesible desde JS (inmune a XSS).
  const store = await cookies()
  store.set(TOKEN_COOKIE, data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8h, igual que la expiración del JWT del back
  })

  // redirect() lanza internamente → debe ir FUERA del try/catch.
  redirect('/')
}

// Cierra sesión: borra la cookie y manda al login.
export async function logout() {
  const store = await cookies()
  store.delete(TOKEN_COOKIE)
  redirect('/login')
}
