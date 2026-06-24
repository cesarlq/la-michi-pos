import Link from 'next/link'
import { requireRole } from '@/lib/auth-guards'
import {
  getDailySummary,
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

// Server Component: valida rol (owner/manager), pide los 3 reportes en paralelo
// y arma la vista. El backend resuelve la sucursal según el rol del JWT.
export default async function ReportsPage() {
  const user = await requireRole('owner', 'manager')
  const isOwner = user.role === 'owner'

  const [summary, salesTrend, topProducts, criticalStock] = await Promise.all([
    getDailySummary(),
    getSalesTrend(7),
    getTopProducts(7, 10),
    getCriticalStock(),
  ])

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Inicio
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-bold text-gray-900">Reportes</h1>
      <p className="mb-6 text-sm text-gray-500">
        {isOwner ? 'Todas las sucursales' : 'Tu sucursal'} · Resumen de hoy
      </p>

      <div className="space-y-8">
        <section>
          <SummaryCards summary={summary} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">
            Ingresos · últimos 7 días
          </h2>
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
            <h2 className="mb-3 text-sm font-semibold text-gray-500">
              Ingreso por categoría
            </h2>
            <CategoryDonut products={topProducts} />
          </section>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">
            Top productos · últimos 7 días
          </h2>
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
