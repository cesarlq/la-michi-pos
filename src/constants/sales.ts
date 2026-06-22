import type { PaymentMethod } from '@/types/api'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
}

export const PAYMENT_METHODS = Object.keys(PAYMENT_LABELS) as PaymentMethod[]
