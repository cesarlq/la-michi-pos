import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth-guards'
import { getUsers } from '@/services/usersService'
import { getBranches } from '@/services/branchesService'
import { updateUser, setUserActive } from '@/actions/users.actions'
import { UserForm } from '@/components/users/UserForm'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireRole('owner')
  const { id } = await params

  // No hay GET /users/{id}; lo resolvemos del listado (pocos usuarios en un POS).
  const [users, branches] = await Promise.all([getUsers(), getBranches()])
  const user = users.find((u) => u.id === id)
  if (!user) notFound()

  const isSelf = user.id === me.id

  return (
    <main className="mx-auto max-w-md p-6">
      <Link href="/users" className="text-sm text-gray-500 hover:text-gray-700">
        ← Volver a usuarios
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">Editar usuario</h1>

      <UserForm
        action={updateUser}
        branches={branches}
        defaultValues={user}
        submitLabel="Guardar cambios"
        isEdit
      />

      {/* No puedes desactivar tu propia cuenta (defensa también en el back). */}
      {!isSelf && (
        <form
          action={setUserActive.bind(null, user.id, !user.active)}
          className="mt-6 border-t border-gray-200 pt-6"
        >
          <button type="submit" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            {user.active ? 'Desactivar usuario' : 'Activar usuario'}
          </button>
        </form>
      )}
    </main>
  )
}
