'use server'

import { revalidatePath } from 'next/cache'
import { apiClient, ApiError } from '@/lib/apiClient'
import { requireRole } from '@/lib/auth-guards'

export type InventoryActionResult = { ok: true } | { ok: false; error: string }

// Reabastecer: suma una entrada de stock. branchId es opcional (owner lo manda;
// para manager el back usa el de su JWT).
export async function restockProduct(
  productId: string,
  quantity: number,
  branchId?: string,
): Promise<InventoryActionResult> {
  await requireRole('owner', 'manager')

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { ok: false, error: 'La cantidad debe ser un entero mayor a 0.' }
  }

  try {
    await apiClient.post('/inventory/restock', { productId, quantity, branchId })
    revalidatePath('/inventory')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : 'No se pudo reabastecer.' }
  }
}

// Fijar el stock mínimo (umbral de alerta).
export async function setMinStock(
  productId: string,
  minStock: number,
  branchId?: string,
): Promise<InventoryActionResult> {
  await requireRole('owner', 'manager')

  if (!Number.isInteger(minStock) || minStock < 0) {
    return { ok: false, error: 'El mínimo debe ser un entero mayor o igual a 0.' }
  }

  try {
    await apiClient.patch('/inventory/min-stock', { productId, minStock, branchId })
    revalidatePath('/inventory')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : 'No se pudo actualizar el mínimo.' }
  }
}
