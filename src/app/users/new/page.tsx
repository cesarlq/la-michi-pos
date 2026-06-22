import Link from 'next/link'
import { requireRole } from '@/lib/auth-guards'
import { createUser } from '@/actions/users.actions'
import { getBranches } from '@/services/branchesService'
import { UserForm } from '@/components/users/UserForm'

export default async function NewUserPage() {
  await requireRole('owner')
  const branches = await getBranches() // solo activas para asignar

  return (
    <main className="mx-auto max-w-md p-6">
      <Link href="/users" className="text-sm text-gray-500 hover:text-gray-700">
        ← Volver a usuarios
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">Nuevo usuario</h1>
      <UserForm action={createUser} branches={branches} submitLabel="Crear usuario" />
    </main>
  )
}
