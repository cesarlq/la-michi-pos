import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopProductsChart } from './TopProductsChart'
import type { TopProduct } from '@/services/reportsService'

vi.mock('recharts', async (importActual) => {
  const actual = await importActual<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 500, height: 300 }}>{children}</div>
    ),
  }
})

const products: TopProduct[] = [
  { productId: '1', productName: 'Paleta de fresa', category: 'paleta', totalQty: 30, totalRevenue: 450 },
  { productId: '2', productName: 'Nieve de vainilla', category: 'nieve', totalQty: 20, totalRevenue: 400 },
]

describe('TopProductsChart', () => {
  it('monta la gráfica cuando hay productos', () => {
    const { container } = render(<TopProductsChart products={products} />)
    expect(screen.queryByText(/aún no hay ventas/i)).toBeNull()
    expect(container.querySelector('.rounded-xl')).toBeInTheDocument()
  })

  it('muestra el estado vacío sin productos', () => {
    render(<TopProductsChart products={[]} />)
    expect(screen.getByText(/aún no hay ventas/i)).toBeInTheDocument()
  })
})
