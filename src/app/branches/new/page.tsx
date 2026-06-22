import Link from 'next/link'
import { requireRole } from '@/lib/auth-guards'
import { createBranch } from '@/actions/branches.actions'
import { BranchForm } from '@/components/branches/BranchForm'

export default async function NewBranchPage() {
  await requireRole('owner')

  return (
    <main className="mx-auto max-w-md p-6">
      <Link href="/branches" className="text-sm text-gray-500 hover:text-gray-700">
        ← Volver a sucursales
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">Nueva sucursal</h1>
      <BranchForm action={createBranch} submitLabel="Crear sucursal" />
    </main>
  )
}
