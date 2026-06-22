import Link from 'next/link'
import { requireRole } from '@/lib/auth-guards'
import { apiClient } from '@/lib/apiClient'
import { getInventory } from '@/services/inventoryService'
import { InventoryTable } from '@/components/inventory/InventoryTable'

type BranchDTO = { id: string; name: string }

// Server Component: owner/manager. El manager ve su sucursal (del JWT);
// el owner elige una (igual que el POS).
export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string }>
}) {
  const user = await requireRole('owner', 'manager')
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
          <h1 className="mt-2 mb-4 text-2xl font-bold text-gray-900">¿Qué sucursal quieres ver?</h1>
          <div className="space-y-2">
            {branches.map((b) => (
              <Link
                key={b.id}
                href={`/inventory?branch=${b.id}`}
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

  // Para owner pasamos branchId explícito; para manager el back usa el de su JWT.
  const [branchRecord, rows] = await Promise.all([
    apiClient.get<BranchDTO>(`/branches/${branchId}`).catch(() => null),
    getInventory(user.role === 'owner' ? branchId : undefined),
  ])

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Inicio
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-bold text-gray-900">Inventario</h1>
      <p className="mb-6 text-sm text-gray-500">{branchRecord?.name ?? 'Sucursal'}</p>

      <InventoryTable rows={rows} branchId={user.role === 'owner' ? branchId : undefined} />
    </main>
  )
}
