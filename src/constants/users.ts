import type { UserRole } from '@/types/api'

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Dueño',
  manager: 'Encargado',
  employee: 'Empleado',
}
