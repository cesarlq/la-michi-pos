import Link from 'next/link'
import { requireRole } from '@/lib/auth-guards'
import { getBranches } from '@/services/branchesService'
import { BranchesTable } from '@/components/branches/BranchesTable'

// Server Component: solo owner. Lista todas las sucursales (activas e inactivas).
export default async function BranchesPage() {
  await requireRole('owner')
  const branches = await getBranches(true)

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Inicio
      </Link>

      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sucursales</h1>
        <Link
          href="/branches/new"
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          + Nueva sucursal
        </Link>
      </div>

      <BranchesTable branches={branches} />
    </main>
  )
}
