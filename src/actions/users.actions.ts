'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/apiClient'
import { requireRole } from '@/lib/auth-guards'
import type { UserRole } from '@/types/api'

const ROLES: UserRole[] = ['owner', 'manager', 'employee']

export type UserFormState = {
  error?: string
  fieldErrors?: { name?: string; email?: string; password?: string; role?: string; branchId?: string }
}

type ParsedCreate = { name: string; email: string; password: string; role: UserRole; branchId: string | null }

// Validación compartida (siempre en el servidor; el back vuelve a validar).
function validateCommon(
  name: string,
  role: string,
  branchId: string,
): NonNullable<UserFormState['fieldErrors']> {
  const fe: NonNullable<UserFormState['fieldErrors']> = {}
  if (!name) fe.name = 'El nombre es obligatorio.'
  if (!ROLES.includes(role as UserRole)) fe.role = 'Elige un rol válido.'
  // manager/employee requieren sucursal; owner no.
  if (role !== 'owner' && !branchId) fe.branchId = 'Encargado y empleado requieren una sucursal.'
  return fe
}

export async function createUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireRole('owner')

  const name = ((formData.get('name') as string) ?? '').trim()
  const email = ((formData.get('email') as string) ?? '').trim().toLowerCase()
  const password = (formData.get('password') as string) ?? ''
  const role = (formData.get('role') as string) ?? ''
  const branchId = (formData.get('branchId') as string) ?? ''

  const fieldErrors = validateCommon(name, role, branchId)
  if (!email || !email.includes('@')) fieldErrors.email = 'Correo inválido.'
  if (password.length < 6) fieldErrors.password = 'Mínimo 6 caracteres.'
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const payload: ParsedCreate = {
    name,
    email,
    password,
    role: role as UserRole,
    branchId: role === 'owner' ? null : branchId,
  }

  try {
    await apiClient.post('/users', payload)
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : 'No se pudo crear el usuario.' }
  }
  revalidatePath('/users')
  redirect('/users')
}

export async function updateUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireRole('owner')
  const id = formData.get('id') as string
  if (!id) return { error: 'Falta el identificador del usuario.' }

  const name = ((formData.get('name') as string) ?? '').trim()
  const role = (formData.get('role') as string) ?? ''
  const branchId = (formData.get('branchId') as string) ?? ''
  const password = ((formData.get('password') as string) ?? '').trim()

  const fieldErrors = validateCommon(name, role, branchId)
  if (password && password.length < 6) fieldErrors.password = 'Mínimo 6 caracteres.'
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  try {
    await apiClient.patch(`/users/${id}`, {
      name,
      role,
      branchId: role === 'owner' ? null : branchId,
      ...(password ? { password } : {}),
    })
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : 'No se pudo actualizar el usuario.' }
  }
  revalidatePath('/users')
  redirect('/users')
}

export async function setUserActive(id: string, active: boolean) {
  await requireRole('owner')
  if (active) {
    await apiClient.patch(`/users/${id}`, { active: true })
  } else {
    await apiClient.delete(`/users/${id}`)
  }
  revalidatePath('/users')
  redirect('/users')
}
