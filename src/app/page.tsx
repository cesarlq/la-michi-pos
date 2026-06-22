import { apiClient, ApiError } from '@/lib/apiClient'
import { requireAuth } from '@/lib/auth-guards'
import { DashboardHome } from '@/components/dashboard/DashboardHome'
import { modulesForRole } from '@/constants/navigation'

type BranchDTO = { id: string; name: string }

export default async function HomePage() {
  const { name, role, branchId } = await requireAuth()

  let branchName: string | null = null
  if (branchId) {
    try {
      const branch = await apiClient.get<BranchDTO>(`/branches/${branchId}`)
      branchName = branch.name
    } catch (e) {
      // Si la sucursal no se encuentra (raro) o hay error de red, no bloqueamos el dashboard.
      if (!(e instanceof ApiError)) console.error('branches fetch:', e)
    }
  }

  return (
    <DashboardHome
      name={name ?? 'Usuario'}
      role={role}
      branchName={branchName}
      modules={modulesForRole(role)}
    />
  )
}
