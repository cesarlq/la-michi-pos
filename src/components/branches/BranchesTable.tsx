import Link from 'next/link'
import type { Branch } from '@/services/branchesService'

export function BranchesTable({ branches }: { branches: Branch[] }) {
  if (branches.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        No hay sucursales todavía.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Sucursal</th>
            <th className="px-4 py-3 font-medium">Contacto</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {branches.map((b) => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{b.name}</p>
                {b.address && <p className="text-xs text-gray-500">{b.address}</p>}
              </td>
              <td className="px-4 py-3 text-gray-600">{b.phone ?? '—'}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    b.active
                      ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
                      : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500'
                  }
                >
                  {b.active ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/branches/${b.id}/edit`}
                  className="font-medium text-rose-600 hover:text-rose-700"
                >
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
