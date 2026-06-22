import { apiClient } from '@/lib/apiClient'

export type Branch = {
  id: string
  name: string
  address: string | null
  phone: string | null
  active: boolean
}

// all=true trae también las inactivas (solo lo respeta el back para owner).
export async function getBranches(all = false): Promise<Branch[]> {
  return apiClient.get<Branch[]>(`/branches${all ? '?all=true' : ''}`)
}

export async function getBranchById(id: string): Promise<Branch | null> {
  try {
    return await apiClient.get<Branch>(`/branches/${id}`)
  } catch {
    return null
  }
}
