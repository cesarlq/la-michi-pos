import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth-guards'
import { getBranchById } from '@/services/branchesService'
import { updateBranch, setBranchActive } from '@/actions/branches.actions'
import { BranchForm } from '@/components/branches/BranchForm'

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('owner')
  const { id } = await params
  const branch = await getBranchById(id)
  if (!branch) notFound()

  return (
    <main className="mx-auto max-w-md p-6">
      <Link href="/branches" className="text-sm text-gray-500 hover:text-gray-700">
        ← Volver a sucursales
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">Editar sucursal</h1>

      <BranchForm action={updateBranch} defaultValues={branch} submitLabel="Guardar cambios" />

      <form
        action={setBranchActive.bind(null, branch.id, !branch.active)}
        className="mt-6 border-t border-gray-200 pt-6"
      >
        <button type="submit" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          {branch.active ? 'Desactivar sucursal' : 'Activar sucursal'}
        </button>
      </form>
    </main>
  )
}
