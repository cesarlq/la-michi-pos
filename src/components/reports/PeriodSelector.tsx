'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Period } from '@/lib/reportPeriod'

const PRESETS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
  { key: 'year', label: 'Año' },
]

// Selector de periodo. Cambia la URL (?period=…) para que el Server Component
// vuelva a hacer fetch. Componente puro de interacción.
export function PeriodSelector({
  active,
  from = '',
  to = '',
}: {
  active: Period
  from?: string
  to?: string
}) {
  const router = useRouter()
  const [customOpen, setCustomOpen] = useState(active === 'custom')
  const [fromVal, setFromVal] = useState(from)
  const [toVal, setToVal] = useState(to)

  const pill = (isActive: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? 'bg-rose-600 text-white'
        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
    }`

  function selectPreset(key: Period) {
    setCustomOpen(false)
    router.push(`/reports?period=${key}`)
  }

  function applyCustom() {
    if (fromVal && toVal) router.push(`/reports?period=custom&from=${fromVal}&to=${toVal}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => selectPreset(p.key)}
          className={pill(active === p.key)}
        >
          {p.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setCustomOpen((v) => !v)}
        className={pill(active === 'custom')}
      >
        Personalizado
      </button>

      {customOpen && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={fromVal}
            onChange={(e) => setFromVal(e.target.value)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
            aria-label="Desde"
          />
          <span className="text-gray-400">—</span>
          <input
            type="date"
            value={toVal}
            onChange={(e) => setToVal(e.target.value)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
            aria-label="Hasta"
          />
          <button
            type="button"
            onClick={applyCustom}
            disabled={!fromVal || !toVal}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  )
}
