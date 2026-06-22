import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryCards } from './SummaryCards'
import type { DailySummary } from '@/services/reportsService'

const summary: DailySummary = {
  date: '2026-06-22',
  saleCount: 5,
  totalRevenue: 250,
  itemsSold: 18,
}

describe('SummaryCards', () => {
  it('muestra ventas, ingresos formateados y unidades', () => {
    render(<SummaryCards summary={summary} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('$250.00')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('maneja un día sin ventas (ceros)', () => {
    render(<SummaryCards summary={{ date: '2026-06-22', saleCount: 0, totalRevenue: 0, itemsSold: 0 }} />)
    expect(screen.getAllByText('0')).toHaveLength(2) // saleCount e itemsSold
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })
})
