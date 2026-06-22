import { useState, useTransition } from 'react'
import { restockProduct, setMinStock } from '@/actions/inventory.actions'

// Encapsula la lógica de mutar UN renglón de inventario (reabastecer / fijar mínimo).
// El componente de fila solo presenta y dispara estas funciones.
export function useInventoryRow(productId: string, branchId?: string) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  function restock(quantity: number) {
    setMessage(null)
    startTransition(async () => {
      const res = await restockProduct(productId, quantity, branchId)
      setMessage(res.ok ? { ok: true, text: `+${quantity} agregadas` } : { ok: false, text: res.error })
    })
  }

  function updateMin(minStock: number) {
    setMessage(null)
    startTransition(async () => {
      const res = await setMinStock(productId, minStock, branchId)
      setMessage(res.ok ? { ok: true, text: 'Mínimo actualizado' } : { ok: false, text: res.error })
    })
  }

  return { isPending, message, restock, updateMin }
}
