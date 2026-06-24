import Link from 'next/link'
import { ROLE_LABELS } from '@/constants/users'
import type { UserRow } from '@/services/usersService'

// branchNames: mapa id→nombre para mostrar la sucursal legible.
export function UsersTable({
  users,
  branchNames,
}: {
  users: UserRow[]
  branchNames: Record<string, string>
}) {
  if (users.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        No hay usuarios.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Usuario</th>
            <th className="px-4 py-3 font-medium">Rol</th>
            <th className="px-4 py-3 font-medium">Sucursal</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </td>
              <td className="px-4 py-3 text-gray-600">{ROLE_LABELS[u.role]}</td>
              <td className="px-4 py-3 text-gray-600">
                {u.branchId ? (branchNames[u.branchId] ?? '—') : 'Todas'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    u.active
                      ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
                      : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500'
                  }
                >
                  {u.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/users/${u.id}/edit`} className="font-medium text-rose-600 hover:text-rose-700">
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
