'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/apiClient'
import { requireRole } from '@/lib/auth-guards'

export type BranchFormState = {
  error?: string
  fieldErrors?: { name?: string }
}

function parseBranchForm(formData: FormData):
  | { ok: true; data: { name: string; address: string | null; phone: string | null } }
  | { ok: false; state: BranchFormState } {
  const name = ((formData.get('name') as string) ?? '').trim()
  const address = ((formData.get('address') as string) ?? '').trim()
  const phone = ((formData.get('phone') as string) ?? '').trim()

  if (!name) return { ok: false, state: { fieldErrors: { name: 'El nombre es obligatorio.' } } }
  return { ok: true, data: { name, address: address || null, phone: phone || null } }
}

export async function createBranch(
  _prev: BranchFormState,
  formData: FormData,
): Promise<BranchFormState> {
  await requireRole('owner')
  const parsed = parseBranchForm(formData)
  if (!parsed.ok) return parsed.state

  try {
    await apiClient.post('/branches', parsed.data)
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : 'No se pudo crear la sucursal.' }
  }
  revalidatePath('/branches')
  redirect('/branches')
}

export async function updateBranch(
  _prev: BranchFormState,
  formData: FormData,
): Promise<BranchFormState> {
  await requireRole('owner')
  const id = formData.get('id') as string
  if (!id) return { error: 'Falta el identificador de la sucursal.' }

  const parsed = parseBranchForm(formData)
  if (!parsed.ok) return parsed.state

  try {
    await apiClient.patch(`/branches/${id}`, parsed.data)
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : 'No se pudo actualizar la sucursal.' }
  }
  revalidatePath('/branches')
  redirect('/branches')
}

// Activa / desactiva (baja lógica).
export async function setBranchActive(id: string, active: boolean) {
  await requireRole('owner')
  if (active) {
    await apiClient.patch(`/branches/${id}`, { active: true })
  } else {
    await apiClient.delete(`/branches/${id}`)
  }
  revalidatePath('/branches')
  redirect('/branches')
}
