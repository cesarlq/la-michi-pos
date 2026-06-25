import Link from 'next/link'
import { requireRole } from '@/lib/auth-guards'
import { resolveRange } from '@/lib/reportPeriod'
import {
  getSummary,
  getSalesTrend,
  getTopProducts,
  getCriticalStock,
} from '@/services/reportsService'
import { SummaryCards } from '@/components/reports/SummaryCards'
import { SalesTrendChart } from '@/components/reports/SalesTrendChart'
import { TopProductsChart } from '@/components/reports/TopProductsChart'
import { CategoryDonut } from '@/components/reports/CategoryDonut'
import { TopProductsList } from '@/components/reports/TopProductsList'
import { CriticalStockTable } from '@/components/reports/CriticalStockTable'
import { ExportButtons } from '@/components/reports/ExportButtons'
import { PeriodSelector } from '@/components/reports/PeriodSelector'

type SearchParams = Promise<{ period?: string; from?: string; to?: string }>

// Server Component: valida rol, resuelve el periodo desde la URL (?period=…),
// pide los reportes del rango en paralelo y arma la vista. Al cambiar el periodo
// cambia la URL → este componente vuelve a hacer fetch.
export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireRole('owner', 'manager')
  const isOwner = user.role === 'owner'
  const scope = isOwner ? 'Todas las sucursales' : 'Tu sucursal'

  const sp = await searchParams
  const range = resolveRange(sp.period, sp.from, sp.to)
  const rangeParams = { from: range.from, to: range.to }

  const [summary, salesTrend, topProducts, criticalStock] = await Promise.all([
    getSummary(rangeParams),
    getSalesTrend(rangeParams),
    getTopProducts(rangeParams, 10),
    getCriticalStock(),
  ])

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Inicio
      </Link>

      <div className="mt-2 mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-sm text-gray-500">
            {scope} · {range.label}
          </p>
        </div>
        <ExportButtons
          data={{
            summary,
            salesTrend,
            topProducts,
            criticalStock,
            scope,
            showBranch: isOwner,
            periodLabel: range.label,
          }}
        />
      </div>

      <div className="mb-6">
        <PeriodSelector active={range.period} from={range.from} to={range.to} />
      </div>

      <div className="space-y-8">
        <section>
          <SummaryCards summary={summary} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Ingresos · {range.label}</h2>
          <SalesTrendChart data={salesTrend} />
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-500">
              Top productos por ingreso
            </h2>
            <TopProductsChart products={topProducts} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-500">Ingreso por categoría</h2>
            <CategoryDonut products={topProducts} />
          </section>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Top productos · {range.label}</h2>
          <TopProductsList products={topProducts} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Stock crítico</h2>
          <CriticalStockTable items={criticalStock} showBranch={isOwner} />
        </section>
      </div>
    </main>
  )
}
