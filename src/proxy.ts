import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken, TOKEN_COOKIE } from '@/lib/jwt'

// "Proxy" es el nombre del middleware en Next.js 16 (antes middleware.ts).
// Corre en el Edge en cada petición. Lee la cookie httpOnly, verifica el JWT
// con jose (mismo secreto que el back) y decide si pasa o redirige a /login.
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  const user = token ? await verifyToken(token) : null
  const isLoggedIn = !!user
  const isOnLogin = pathname.startsWith('/login')

  if (isOnLogin) {
    // Ya con sesión entrando a /login → mándalo al inicio.
    if (isLoggedIn) return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next() // permite ver /login a quien NO tiene sesión
  }

  // Cualquier otra ruta requiere sesión.
  if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url))
  return NextResponse.next()
}

export const config = {
  // Corre en todo EXCEPTO las API, los assets de Next y el favicon.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
