import Link from 'next/link'
import { CATEGORY_LABELS } from '@/constants/products'
import { formatCurrency } from '@/utils/format'
import type { ProductRow } from '@/services/productsService'

type ProductsTableProps = {
  products: ProductRow[]
  // Cuando es true (dueño), muestra la columna de acciones (Editar).
  canManage?: boolean
}

export function ProductsTable({ products, canManage = false }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        No hay productos que coincidan.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 text-right font-medium">Precio</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            {canManage && (
              <th className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
              <td className="px-4 py-3 text-gray-600">{CATEGORY_LABELS[p.category]}</td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-900">
                {formatCurrency(p.price)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    p.active
                      ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
                      : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500'
                  }
                >
                  {p.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              {canManage && (
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/products/${p.id}/edit`}
                    className="font-medium text-rose-600 hover:text-rose-700"
                  >
                    Editar
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
