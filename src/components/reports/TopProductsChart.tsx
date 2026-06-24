'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '@/utils/format'
import type { TopProduct } from '@/services/reportsService'

const BAR_COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3']

// Barras horizontales: top productos por ingreso. Componente puro.
export function TopProductsChart({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Aún no hay ventas en el periodo.
      </p>
    )
  }

  // Mostramos los 6 con más ingreso, de mayor a menor.
  const data = [...products]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 6)
    .map((p) => ({ name: p.productName, revenue: p.totalRevenue }))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${v}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#475569' }}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip
            formatter={(v) => [formatCurrency(Number(v ?? 0)), 'Ingresos']}
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
