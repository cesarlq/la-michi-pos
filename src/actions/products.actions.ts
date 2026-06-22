'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/apiClient'
import { requireRole } from '@/lib/auth-guards'
import { CATEGORIES } from '@/constants/products'
import type { ProductCategory } from '@/types/api'

export type ProductFormState = {
  error?: string
  fieldErrors?: {
    name?: string
    category?: string
    price?: string
  }
}

// Validación compartida entre crear y editar (siempre en el servidor).
function parseProductForm(formData: FormData):
  | { ok: true; data: { name: string; category: ProductCategory; price: number } }
  | { ok: false; state: ProductFormState } {
  const name = ((formData.get('name') as string) ?? '').trim()
  const category = formData.get('category') as string
  const priceRaw = (formData.get('price') as string) ?? ''
  const price = Number(priceRaw)

  const fieldErrors: NonNullable<ProductFormState['fieldErrors']> = {}
  if (!name) fieldErrors.name = 'El nombre es obligatorio.'
  if (!CATEGORIES.includes(category as ProductCategory)) fieldErrors.category = 'Elige una categoría válida.'
  if (priceRaw === '' || Number.isNaN(price) || price < 0) {
    fieldErrors.price = 'El precio debe ser un número mayor o igual a 0.'
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, state: { fieldErrors } }
  return { ok: true, data: { name, category: category as ProductCategory, price } }
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireRole('owner')
  const parsed = parseProductForm(formData)
  if (!parsed.ok) return parsed.state

  try {
    await apiClient.post('/products', parsed.data)
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'No se pudo crear el producto.'
    return { error: msg }
  }

  revalidatePath('/products')
  redirect('/products')
}

export async function updateProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireRole('owner')
  const id = formData.get('id') as string
  if (!id) return { error: 'Falta el identificador del producto.' }

  const parsed = parseProductForm(formData)
  if (!parsed.ok) return parsed.state

  try {
    await apiClient.patch(`/products/${id}`, parsed.data)
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'No se pudo actualizar el producto.'
    return { error: msg }
  }

  revalidatePath('/products')
  redirect('/products')
}

export async function setProductActive(id: string, active: boolean) {
  await requireRole('owner')
  if (active) {
    await apiClient.patch(`/products/${id}`, { active })
  } else {
    await apiClient.delete(`/products/${id}`)
  }
  revalidatePath('/products')
  redirect('/products')
}
