import Link from 'next/link'
import { requireRole } from '@/lib/auth-guards'
import { getUsers } from '@/services/usersService'
import { getBranches } from '@/services/branchesService'
import { UsersTable } from '@/components/users/UsersTable'

// Server Component: solo owner. Lista usuarios y resuelve nombres de sucursal.
export default async function UsersPage() {
  await requireRole('owner')

  const [users, branches] = await Promise.all([getUsers(), getBranches(true)])
  const branchNames = Object.fromEntries(branches.map((b) => [b.id, b.name]))

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Inicio
      </Link>

      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <Link
          href="/users/new"
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          + Nuevo usuario
        </Link>
      </div>

      <UsersTable users={users} branchNames={branchNames} />
    </main>
  )
}
