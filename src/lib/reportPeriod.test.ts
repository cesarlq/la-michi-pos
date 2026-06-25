import { describe, it, expect } from 'vitest'
import { resolveRange, isValidPeriod } from './reportPeriod'

describe('reportPeriod', () => {
  it('default es semana (7 días)', () => {
    const r = resolveRange()
    expect(r.period).toBe('week')
    expect(r.label).toBe('Última semana')
    const days =
      (Date.parse(r.to) - Date.parse(r.from)) / 86_400_000 + 1
    expect(days).toBe(7)
  })

  it('mes resuelve a 30 días', () => {
    const r = resolveRange('month')
    expect(r.period).toBe('month')
    const days = (Date.parse(r.to) - Date.parse(r.from)) / 86_400_000 + 1
    expect(days).toBe(30)
  })

  it('año resuelve a 365 días', () => {
    const r = resolveRange('year')
    const days = (Date.parse(r.to) - Date.parse(r.from)) / 86_400_000 + 1
    expect(days).toBe(365)
  })

  it('custom usa el rango dado y lo ordena', () => {
    const r = resolveRange('custom', '2026-06-30', '2026-06-01')
    expect(r.period).toBe('custom')
    expect(r.from).toBe('2026-06-01')
    expect(r.to).toBe('2026-06-30')
    expect(r.label).toBe('2026-06-01 — 2026-06-30')
  })

  it('custom sin fechas cae a semana', () => {
    expect(resolveRange('custom').period).toBe('week')
  })

  it('periodo inválido cae a semana', () => {
    expect(resolveRange('xxx').period).toBe('week')
  })

  it('isValidPeriod', () => {
    expect(isValidPeriod('week')).toBe(true)
    expect(isValidPeriod('custom')).toBe(true)
    expect(isValidPeriod('nope')).toBe(false)
    expect(isValidPeriod(null)).toBe(false)
  })
})
