import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSale } from '@/actions/sales.actions'
import { formatCurrency } from '@/utils/format'
import type { PaymentMethod } from '@/types/api'
import type { SellableProduct } from '@/services/salesService'

export type CartItem = { productId: string; name: string; price: number; quantity: number; stock: number }

// Encapsula TODA la lógica del carrito y el cobro. El componente solo presenta.
// El tope de stock y el total son ESPEJO de UX — el servidor (Go) es la autoridad
// y revalida todo; aquí solo damos feedback inmediato.
export function usePointOfSale(branchId: string) {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [payment, setPayment] = useState<PaymentMethod>('cash')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  function add(p: SellableProduct) {
    setMessage(null)
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === p.id)
      if (existing) {
        if (existing.quantity >= p.stock) return prev
        return prev.map((i) => (i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { productId: p.id, name: p.name, price: p.price, quantity: 1, stock: p.stock }]
    })
  }

  function setQuantity(productId: string, quantity: number) {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.productId !== productId) return [i]
        const q = Math.max(0, Math.min(quantity, i.stock))
        return q === 0 ? [] : [{ ...i, quantity: q }]
      }),
    )
  }

  async function checkout() {
    setPending(true)
    setMessage(null)
    const result = await createSale({
      branchId,
      paymentMethod: payment,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    })
    setPending(false)
    if (result.ok) {
      setItems([])
      setMessage({ ok: true, text: `Venta registrada por ${formatCurrency(result.total)}.` })
      router.refresh()
    } else {
      setMessage({ ok: false, text: result.error })
    }
  }

  return { items, total, payment, setPayment, pending, message, add, setQuantity, checkout }
}
