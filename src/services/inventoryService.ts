import { apiClient } from '@/lib/apiClient'
import type { ProductCategory } from '@/types/api'

// Renglón de inventario: un producto con su stock y mínimo en una sucursal.
export type InventoryRow = {
  productId: string
  productName: string
  category: ProductCategory
  price: number
  currentStock: number
  minStock: number
}

// El back resuelve la sucursal según el rol del JWT (manager solo la suya).
// Para owner se pasa branchId; para manager el back lo ignora y usa el del token.
export async function getInventory(branchId?: string): Promise<InventoryRow[]> {
  const qs = branchId ? `?branch_id=${branchId}` : ''
  return apiClient.get<InventoryRow[]>(`/inventory${qs}`)
}
