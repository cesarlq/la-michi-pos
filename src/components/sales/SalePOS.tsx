'use client'

import { usePointOfSale } from '@/hooks/usePointOfSale'
import { formatCurrency } from '@/utils/format'
import { PAYMENT_LABELS, PAYMENT_METHODS } from '@/constants/sales'
import type { SellableProduct } from '@/services/salesService'

// Componente de PRESENTACIÓN: toda la lógica vive en usePointOfSale.
export function SalePOS({
  branchId,
  branchName,
  products,
}: {
  branchId: string
  branchName: string
  products: SellableProduct[]
}) {
  const pos = usePointOfSale(branchId)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Productos disponibles */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-500">Productos · {branchName}</h2>
        <div className="grid grid-cols-2 gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={p.stock === 0}
              onClick={() => pos.add(p)}
              className="rounded-xl border border-gray-200 p-3 text-left transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <p className="text-sm font-medium text-gray-900">{p.name}</p>
              <p className="text-sm text-rose-600">{formatCurrency(p.price)}</p>
              <p className="text-xs text-gray-400">Stock: {p.stock}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Carrito */}
      <section className="rounded-xl border border-gray-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-500">Carrito</h2>

        {pos.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">Agrega productos para cobrar.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pos.items.map((i) => (
              <li key={i.productId} className="flex items-center gap-2 py-2">
                <span className="flex-1 text-sm text-gray-900">{i.name}</span>
                <input
                  type="number"
                  min={1}
                  max={i.stock}
                  value={i.quantity}
                  onChange={(e) => pos.setQuantity(i.productId, Number(e.target.value))}
                  aria-label={`Cantidad de ${i.name}`}
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <span className="w-20 text-right text-sm tabular-nums text-gray-900">
                  {formatCurrency(i.price * i.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => pos.setQuantity(i.productId, 0)}
                  aria-label={`Quitar ${i.name}`}
                  className="text-gray-400 hover:text-red-600"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(pos.total)}</span>
        </div>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Método de pago
          <select
            value={pos.payment}
            onChange={(e) => pos.setPayment(e.target.value as (typeof PAYMENT_METHODS)[number])}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {PAYMENT_LABELS[m]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={pos.pending || pos.items.length === 0}
          onClick={pos.checkout}
          className="mt-4 w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
        >
          {pos.pending ? 'Cobrando…' : `Cobrar ${formatCurrency(pos.total)}`}
        </button>

        {pos.message && (
          <p
            className={`mt-3 rounded-lg px-3 py-2 text-sm ${
              pos.message.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {pos.message.text}
          </p>
        )}
      </section>
    </div>
  )
}
