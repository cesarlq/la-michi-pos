'use client'

import { useState } from 'react'
import { CATEGORY_LABELS } from '@/constants/products'
import { formatCurrency } from '@/utils/format'
import { useInventoryRow } from '@/hooks/useInventoryRow'
import type { InventoryRow as InventoryRowData } from '@/services/inventoryService'

// Una fila de inventario con sus controles (reabastecer + editar mínimo).
// La lógica vive en useInventoryRow; este componente solo presenta.
export function InventoryRow({ row, branchId }: { row: InventoryRowData; branchId?: string }) {
  const { isPending, message, restock, updateMin } = useInventoryRow(row.productId, branchId)
  const [qty, setQty] = useState('')
  const [min, setMin] = useState(String(row.minStock))

  const isCritical = row.currentStock <= row.minStock

  function handleRestock() {
    const n = Number(qty)
    if (Number.isInteger(n) && n > 0) {
      restock(n)
      setQty('')
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900">{row.productName}</p>
        <p className="text-xs text-gray-500">
          {CATEGORY_LABELS[row.category]} · {formatCurrency(row.price)}
        </p>
      </td>

      {/* Stock actual */}
      <td className="px-4 py-3 text-center">
        <span
          className={
            isCritical
              ? 'rounded-full bg-amber-100 px-2 py-0.5 text-sm font-semibold tabular-nums text-amber-700'
              : 'text-sm font-semibold tabular-nums text-gray-900'
          }
        >
          {row.currentStock}
        </span>
      </td>

      {/* Editar mínimo */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <input
            type="number"
            min={0}
            value={min}
            onChange={(e) => setMin(e.target.value)}
            aria-label={`Mínimo de ${row.productName}`}
            className="w-16 rounded border border-gray-300 px-2 py-1 text-sm tabular-nums"
          />
          <button
            type="button"
            disabled={isPending || min === String(row.minStock)}
            onClick={() => updateMin(Number(min))}
            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </td>

      {/* Reabastecer */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <input
            type="number"
            min={1}
            value={qty}
            placeholder="0"
            onChange={(e) => setQty(e.target.value)}
            aria-label={`Reabastecer ${row.productName}`}
            className="w-16 rounded border border-gray-300 px-2 py-1 text-sm tabular-nums"
          />
          <button
            type="button"
            disabled={isPending || !qty}
            onClick={handleRestock}
            className="rounded bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-40"
          >
            + Entrada
          </button>
        </div>
        {message && (
          <p className={`mt-1 text-center text-xs ${message.ok ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </td>
    </tr>
  )
}
