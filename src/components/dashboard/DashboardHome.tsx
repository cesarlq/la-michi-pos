import Link from 'next/link'
import type { UserRole } from '@/types/api'
import { logout } from '@/actions/auth.actions'
import { ROLE_LABELS } from '@/constants/users'
import type { NavModule } from '@/constants/navigation'

type DashboardHomeProps = {
  name: string
  role: UserRole
  branchName: string | null
  modules: NavModule[]
}

// Componente puro: recibe el usuario y SUS módulos (ya filtrados por rol) y los pinta.
export function DashboardHome({ name, role, branchName, modules }: DashboardHomeProps) {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">🍦 La Michi POS</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Hola, {name} 👋</h1>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-medium text-rose-600">{ROLE_LABELS[role]}</span>
            {' · '}
            <span>{branchName ?? 'Todas las sucursales'}</span>
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) =>
          m.available ? (
            <Link
              key={m.href}
              href={m.href}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-rose-300 hover:shadow-sm"
            >
              <div className="text-2xl">{m.emoji}</div>
              <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-rose-600">{m.label}</h3>
              <p className="mt-1 text-sm text-gray-500">{m.description}</p>
            </Link>
          ) : (
            <div
              key={m.href}
              className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5"
            >
              <div className="text-2xl opacity-40">{m.emoji}</div>
              <h3 className="mt-2 flex items-center gap-2 font-semibold text-gray-400">
                {m.label}
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  Próximamente
                </span>
              </h3>
              <p className="mt-1 text-sm text-gray-400">{m.description}</p>
            </div>
          ),
        )}
      </section>
    </main>
  )
}
