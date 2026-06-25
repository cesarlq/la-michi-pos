// Resuelve un "periodo" (semana/mes/año/personalizado) a un rango de fechas
// concreto [from, to] en formato YYYY-MM-DD (UTC), que se manda al backend.

export type Period = 'week' | 'month' | 'year' | 'custom'

const DAYS: Record<Exclude<Period, 'custom'>, number> = { week: 7, month: 30, year: 365 }

const LABELS: Record<Period, string> = {
  week: 'Última semana',
  month: 'Último mes',
  year: 'Último año',
  custom: 'Personalizado',
}

export type ResolvedRange = {
  period: Period
  from: string // YYYY-MM-DD
  to: string // YYYY-MM-DD
  label: string
}

const iso = (d: Date) => d.toISOString().slice(0, 10)

export function isValidPeriod(p?: string | null): p is Period {
  return p === 'week' || p === 'month' || p === 'year' || p === 'custom'
}

// Default: última semana. Si period='custom' con from/to válidos, usa ese rango.
export function resolveRange(period?: string | null, from?: string, to?: string): ResolvedRange {
  if (period === 'custom' && from && to) {
    const [lo, hi] = from <= to ? [from, to] : [to, from]
    return { period: 'custom', from: lo, to: hi, label: `${lo} — ${hi}` }
  }

  const p: Period = period === 'month' || period === 'year' ? period : 'week'
  const today = new Date()
  const start = new Date(today)
  start.setUTCDate(start.getUTCDate() - (DAYS[p] - 1))
  return { period: p, from: iso(start), to: iso(today), label: LABELS[p] }
}
