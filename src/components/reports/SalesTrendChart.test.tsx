import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SalesTrendChart } from './SalesTrendChart'
import type { SalesTrendPoint } from '@/services/reportsService'

// Recharts no mide su contenedor en jsdom; lo reemplazamos por un div con tamaño fijo.
vi.mock('recharts', async (importActual) => {
  const actual = await importActual<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 500, height: 240 }}>{children}</div>
    ),
  }
})

const data: SalesTrendPoint[] = [
  { date: '2026-06-20', saleCount: 3, totalRevenue: 150 },
  { date: '2026-06-21', saleCount: 0, totalRevenue: 0 },
]

describe('SalesTrendChart', () => {
  it('monta la gráfica cuando hay ventas en el periodo', () => {
    const { container } = render(<SalesTrendChart data={data} />)
    expect(screen.queryByText(/aún no hay ventas/i)).toBeNull()
    expect(container.querySelector('.rounded-xl')).toBeInTheDocument()
  })

  it('muestra el estado vacío cuando todos los días están en cero', () => {
    const empty: SalesTrendPoint[] = [
      { date: '2026-06-20', saleCount: 0, totalRevenue: 0 },
      { date: '2026-06-21', saleCount: 0, totalRevenue: 0 },
    ]
    render(<SalesTrendChart data={empty} />)
    expect(screen.getByText(/aún no hay ventas/i)).toBeInTheDocument()
  })
})
