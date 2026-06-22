import { LoginForm } from '@/components/login/LoginForm'

// Server Component delgado: solo arma el layout y renderiza el formulario (client).
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 p-4">
      <LoginForm />
    </main>
  )
}

