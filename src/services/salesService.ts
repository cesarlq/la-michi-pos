// salesService — tipos de dominio para ventas.
// La lógica de negocio vive en el backend Go (Lambda sales).
// Este archivo solo exporta los tipos que comparten actions, hooks y componentes.

import type { PaymentMethod } from '@/types/api'

export type { SellableProduct } from '@/services/productsService'

export type SaleActor = { id: string; role: string; branchId: string | null }

export type RegisterSaleInput = {
  branchId: string
  paymentMethod: PaymentMethod
  items: { productId: string; quantity: number }[]
}

export type RegisterSaleResult =
  | { ok: true; saleId: string; total: number }
  | { ok: false; error: string }
