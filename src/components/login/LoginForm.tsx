'use client'

import { useActionState } from 'react'
import { authenticate } from '@/actions/auth.actions'

export function LoginForm() {
  // useActionState devuelve: [valor que retornó la acción, función para el form, estado pendiente]
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-rose-600">🍦 La Michi POS</h1>
        <p className="mt-1 text-sm text-gray-500">Inicia sesión para continuar</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="dueno@lamichi.com"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {errorMessage && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-rose-600 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
        >
          {isPending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
