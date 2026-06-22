import { CATEGORY_LABELS } from '@/constants/products'
import type { CriticalStock } from '@/services/reportsService'

// Productos con stock ≤ mínimo. Componente puro.
// showBranch=true muestra la columna de sucursal (útil para el dueño que ve todas).
export function CriticalStockTable({
  items,
  showBranch = false,
}: {
  items: CriticalStock[]
  showBranch?: boolean
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-green-300 bg-green-50 p-8 text-center text-sm text-green-700">
        ✓ Todo el inventario está por encima del mínimo.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            {showBranch && <th className="px-4 py-3 font-medium">Sucursal</th>}
            <th className="px-4 py-3 text-right font-medium">Stock</th>
            <th className="px-4 py-3 text-right font-medium">Mínimo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((it) => (
            <tr key={`${it.productId}-${it.branchId}`} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{it.productName}</td>
              <td className="px-4 py-3 text-gray-600">{CATEGORY_LABELS[it.category]}</td>
              {showBranch && <td className="px-4 py-3 text-gray-600">{it.branchName}</td>}
              <td className="px-4 py-3 text-right">
                <span
                  className={
                    it.currentStock === 0
                      ? 'rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-red-700'
                      : 'rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-amber-700'
                  }
                >
                  {it.currentStock}
                </span>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-500">{it.minStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
