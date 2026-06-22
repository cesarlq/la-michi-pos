import { apiClient } from '@/lib/apiClient'
import type { UserRole } from '@/types/api'

// Usuario tal como lo devuelve el back (sin password_hash, jamás).
export type UserRow = {
  id: string
  name: string
  email: string
  role: UserRole
  branchId: string | null
  active: boolean
}

export async function getUsers(): Promise<UserRow[]> {
  return apiClient.get<UserRow[]>('/users')
}
