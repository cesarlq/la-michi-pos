import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportButtons } from './ExportButtons'
import type { ReportData } from '@/lib/reportExport'

// Mockeamos el util: el componente solo debe delegar, no generar archivos en el test.
vi.mock('@/lib/reportExport', () => ({
  exportReportToExcel: vi.fn().mockResolvedValue(undefined),
  exportReportToPdf: vi.fn().mockResolvedValue(undefined),
}))

import { exportReportToExcel, exportReportToPdf } from '@/lib/reportExport'

const data: ReportData = {
  summary: { date: '2026-06-24', saleCount: 3, totalRevenue: 150, itemsSold: 9 },
  salesTrend: [{ date: '2026-06-24', saleCount: 3, totalRevenue: 150 }],
  topProducts: [
    { productId: '1', productName: 'Paleta', category: 'paleta', totalQty: 5, totalRevenue: 75 },
  ],
  criticalStock: [],
  scope: 'Todas las sucursales',
  periodLabel: 'Última semana',
  showBranch: true,
}

describe('ExportButtons', () => {
  beforeEach(() => vi.clearAllMocks())

  it('muestra los botones Excel y PDF', () => {
    render(<ExportButtons data={data} />)
    expect(screen.getByRole('button', { name: 'Excel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'PDF' })).toBeInTheDocument()
  })

  it('exporta a Excel al hacer clic', async () => {
    render(<ExportButtons data={data} />)
    await userEvent.click(screen.getByRole('button', { name: 'Excel' }))
    expect(exportReportToExcel).toHaveBeenCalledWith(data)
  })

  it('exporta a PDF al hacer clic', async () => {
    render(<ExportButtons data={data} />)
    await userEvent.click(screen.getByRole('button', { name: 'PDF' }))
    expect(exportReportToPdf).toHaveBeenCalledWith(data)
  })
})
