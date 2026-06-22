'use server'

import { revalidatePath } from 'next/cache'
import { apiClient, ApiError } from '@/lib/apiClient'
import { requireAuth } from '@/lib/auth-guards'
import type { PaymentMethod } from '@/types/api'
import type { RegisterSaleResult } from '@/services/salesService'

export type CreateSaleInput = {
  branchId: string
  paymentMethod: PaymentMethod
  items: { productId: string; quantity: number }[]
}

// Respuesta del backend Go al crear una venta.
type SaleDTO = {
  id: string
  total: number
}

// Server Action: autentica, llama al API Go y traduce la respuesta al formato
// que espera el hook usePointOfSale (RegisterSaleResult).
export async function createSale(input: CreateSaleInput): Promise<RegisterSaleResult> {
  await requireAuth()

  try {
    const sale = await apiClient.post<SaleDTO>('/sales', {
      branchId: input.branchId,
      paymentMethod: input.paymentMethod,
      items: input.items,
    })
    revalidatePath('/products') // el stock cambió
    return { ok: true, saleId: sale.id, total: sale.total }
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'No se pudo registrar la venta.'
    return { ok: false, error: msg }
  }
}
