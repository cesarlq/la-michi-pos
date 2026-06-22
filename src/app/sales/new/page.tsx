import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth-guards'
import { apiClient } from '@/lib/apiClient'
import { getSellableProducts } from '@/services/productsService'
import { SalePOS } from '@/components/sales/SalePOS'

type BranchDTO = { id: string; name: string }

export default async function NewSalePage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string }>
}) {
  const user = await requireAuth()
  const { branch } = await searchParams

  let branchId = user.branchId

  if (user.role === 'owner') {
    if (!branch) {
      const branches = await apiClient.get<BranchDTO[]>('/branches')
      return (
        <main className="mx-auto max-w-md p-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Inicio
          </Link>
          <h1 className="mt-2 mb-4 text-2xl font-bold text-gray-900">¿En qué sucursal vendes?</h1>
          <div className="space-y-2">
            {branches.map((b) => (
              <Link
                key={b.id}
                href={`/sales/new?branch=${b.id}`}
                className="block rounded-lg border border-gray-200 p-4 hover:border-rose-300"
              >
                🏪 {b.name}
              </Link>
            ))}
          </div>
        </main>
      )
    }
    branchId = branch
  }

  if (!branchId) {
    return (
      <main className="mx-auto max-w-md p-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Inicio
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          No tienes una sucursal asignada. Pídele a tu encargado que te asigne una.
        </p>
      </main>
    )
  }

  const [branchRecord, products] = await Promise.all([
    apiClient.get<BranchDTO>(`/branches/${branchId}`).catch(() => null),
    getSellableProducts(branchId),
  ])

  if (!branchRecord) notFound()

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Inicio
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">
        Punto de venta · {branchRecord.name}
      </h1>
      <SalePOS branchId={branchId} branchName={branchRecord.name} products={products} />
    </main>
  )
}
