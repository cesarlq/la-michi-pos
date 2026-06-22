import { CATEGORY_LABELS } from '@/constants/products'
import { formatCurrency } from '@/utils/format'
import type { TopProduct } from '@/services/reportsService'

// Ranking de productos más vendidos. Componente puro.
export function TopProductsList({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Aún no hay ventas en el periodo.
      </p>
    )
  }

  return (
    <ol className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200">
      {products.map((p, i) => (
        <li key={p.productId} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-700">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{p.productName}</p>
            <p className="text-xs text-gray-500">{CATEGORY_LABELS[p.category]}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums text-gray-900">{p.totalQty} u.</p>
            <p className="text-xs tabular-nums text-gray-500">{formatCurrency(p.totalRevenue)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
