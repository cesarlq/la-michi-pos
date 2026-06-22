import { formatCurrency } from '@/utils/format'
import type { DailySummary } from '@/services/reportsService'

// Tarjetas con el resumen de ventas del día. Componente puro.
export function SummaryCards({ summary }: { summary: DailySummary }) {
  const cards = [
    { label: 'Ventas del día', value: summary.saleCount.toString(), emoji: '🧾' },
    { label: 'Ingresos', value: formatCurrency(summary.totalRevenue), emoji: '💰' },
    { label: 'Unidades vendidas', value: summary.itemsSold.toString(), emoji: '🍦' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-2xl">{c.emoji}</div>
          <p className="mt-2 text-sm text-gray-500">{c.label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">{c.value}</p>
        </div>
      ))}
    </div>
  )
}
