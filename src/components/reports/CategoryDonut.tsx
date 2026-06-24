'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_LABELS } from '@/constants/products'
import { formatCurrency } from '@/utils/format'
import type { ProductCategory } from '@/types/api'
import type { TopProduct } from '@/services/reportsService'

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  paleta: '#f43f5e',
  nieve: '#38bdf8',
  agua_fresca: '#34d399',
  otro: '#a78bfa',
}

// Agrupa el ingreso de top-products por categoría. Dona. Componente puro.
export function CategoryDonut({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Aún no hay ventas en el periodo.
      </p>
    )
  }

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + p.totalRevenue
    return acc
  }, {})

  const data = (Object.keys(byCategory) as ProductCategory[]).map((cat) => ({
    category: cat,
    name: CATEGORY_LABELS[cat],
    value: byCategory[cat],
  }))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((d) => (
              <Cell key={d.category} fill={CATEGORY_COLORS[d.category]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [formatCurrency(Number(v ?? 0)), 'Ingresos']}
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
