'use client'

import { useActionState } from 'react'
import type { ProductCategory } from '@/types/api'
import type { ProductFormState } from '@/actions/products.actions'
import { CATEGORIES, CATEGORY_LABELS } from '@/constants/products'

type ProductFormProps = {
  // La action (crear o editar) se inyecta → el form sirve para ambos casos.
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>
  defaultValues?: { id?: string; name?: string; category?: ProductCategory; price?: number }
  submitLabel?: string
}

const inputClass =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
const errorClass = 'mt-1 text-xs text-red-600'

export function ProductForm({ action, defaultValues, submitLabel = 'Guardar' }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <form action={formAction} className="space-y-4">
      {/* En edición mandamos el id oculto para que la action sepa qué producto actualizar. */}
      {defaultValues?.id && <input type="hidden" name="id" value={defaultValues.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name ?? ''}
          placeholder="Paleta de mango con chile"
          className={inputClass}
        />
        {state.fieldErrors?.name && <p className={errorClass}>{state.fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="category"
          name="category"
          defaultValue={defaultValues?.category ?? 'paleta'}
          className={inputClass}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        {state.fieldErrors?.category && <p className={errorClass}>{state.fieldErrors.category}</p>}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Precio (MXN)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={defaultValues?.price}
          placeholder="25.00"
          className={inputClass}
        />
        {state.fieldErrors?.price && <p className={errorClass}>{state.fieldErrors.price}</p>}
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-rose-600 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
      >
        {isPending ? 'Guardando…' : submitLabel}
      </button>
    </form>
  )
}
