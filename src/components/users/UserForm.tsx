'use client'

import { useActionState, useState } from 'react'
import type { UserFormState } from '@/actions/users.actions'
import type { UserRole } from '@/types/api'
import { ROLE_LABELS } from '@/constants/users'

type BranchOption = { id: string; name: string }

type UserFormProps = {
  action: (prevState: UserFormState, formData: FormData) => Promise<UserFormState>
  branches: BranchOption[]
  defaultValues?: { id?: string; name?: string; email?: string; role?: UserRole; branchId?: string | null }
  submitLabel?: string
  isEdit?: boolean
}

const inputClass =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
const errorClass = 'mt-1 text-xs text-red-600'
const ROLES: UserRole[] = ['owner', 'manager', 'employee']

export function UserForm({ action, branches, defaultValues, submitLabel = 'Guardar', isEdit = false }: UserFormProps) {
  const [state, formAction, isPending] = useActionState(action, {})
  const [role, setRole] = useState<UserRole>(defaultValues?.role ?? 'employee')

  const needsBranch = role !== 'owner'

  return (
    <form action={formAction} className="space-y-4">
      {defaultValues?.id && <input type="hidden" name="id" value={defaultValues.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input id="name" name="name" type="text" required defaultValue={defaultValues?.name ?? ''} className={inputClass} />
        {state.fieldErrors?.name && <p className={errorClass}>{state.fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
        <input
          id="email"
          name="email"
          type="email"
          required={!isEdit}
          readOnly={isEdit}
          defaultValue={defaultValues?.email ?? ''}
          className={`${inputClass} ${isEdit ? 'bg-gray-50 text-gray-500' : ''}`}
        />
        {isEdit && <p className="mt-1 text-xs text-gray-400">El correo no se puede cambiar.</p>}
        {state.fieldErrors?.email && <p className={errorClass}>{state.fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña {isEdit && <span className="text-gray-400">(dejar en blanco para no cambiar)</span>}
        </label>
        <input id="password" name="password" type="password" required={!isEdit} minLength={6} className={inputClass} />
        {state.fieldErrors?.password && <p className={errorClass}>{state.fieldErrors.password}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className={inputClass}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
        {state.fieldErrors?.role && <p className={errorClass}>{state.fieldErrors.role}</p>}
      </div>

      {needsBranch && (
        <div>
          <label htmlFor="branchId" className="block text-sm font-medium text-gray-700">Sucursal</label>
          <select id="branchId" name="branchId" defaultValue={defaultValues?.branchId ?? ''} className={inputClass}>
            <option value="">Selecciona una sucursal…</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {state.fieldErrors?.branchId && <p className={errorClass}>{state.fieldErrors.branchId}</p>}
        </div>
      )}

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>}

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
