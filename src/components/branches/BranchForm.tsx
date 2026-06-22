'use client'

import { useActionState } from 'react'
import type { BranchFormState } from '@/actions/branches.actions'

type BranchFormProps = {
  action: (prevState: BranchFormState, formData: FormData) => Promise<BranchFormState>
  defaultValues?: { id?: string; name?: string; address?: string | null; phone?: string | null }
  submitLabel?: string
}

const inputClass =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500'

export function BranchForm({ action, defaultValues, submitLabel = 'Guardar' }: BranchFormProps) {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <form action={formAction} className="space-y-4">
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
          placeholder="La Michi Centro"
          className={inputClass}
        />
        {state.fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Dirección <span className="text-gray-400">(opcional)</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          defaultValue={defaultValues?.address ?? ''}
          placeholder="Av. Juárez 123"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Teléfono <span className="text-gray-400">(opcional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues?.phone ?? ''}
          placeholder="55 1234 5678"
          className={inputClass}
        />
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
