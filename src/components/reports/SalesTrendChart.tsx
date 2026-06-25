'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '@/utils/format'
import type { SalesTrendPoint } from '@/services/reportsService'

// Etiqueta corta para el eje X: "2026-06-21" → "21/06".
function shortDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

// Gráfica de área con los ingresos por día. Componente puro: recibe los puntos.
export function SalesTrendChart({ data }: { data: SalesTrendPoint[] }) {
  const hasSales = data.some((p) => p.totalRevenue > 0)

  if (!hasSales) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Aún no hay ventas en el periodo.
      </p>
    )
  }

  const chartData = data.map((p) => ({ ...p, label: shortDate(p.date) }))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            formatter={(v) => [formatCurrency(Number(v ?? 0)), 'Ingresos']}
            labelFormatter={(label) => `Día ${label}`}
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
          />
          <Area
            type="monotone"
            dataKey="totalRevenue"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="url(#revenueFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
