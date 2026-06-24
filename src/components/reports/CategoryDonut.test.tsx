import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CategoryDonut } from './CategoryDonut'
import type { TopProduct } from '@/services/reportsService'

vi.mock('recharts', async (importActual) => {
  const actual = await importActual<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 500, height: 240 }}>{children}</div>
    ),
  }
})

const products: TopProduct[] = [
  { productId: '1', productName: 'Paleta de fresa', category: 'paleta', totalQty: 30, totalRevenue: 450 },
  { productId: '2', productName: 'Paleta de mango', category: 'paleta', totalQty: 10, totalRevenue: 150 },
  { productId: '3', productName: 'Nieve de vainilla', category: 'nieve', totalQty: 20, totalRevenue: 400 },
]

describe('CategoryDonut', () => {
  it('monta la dona cuando hay productos', () => {
    const { container } = render(<CategoryDonut products={products} />)
    expect(screen.queryByText(/aún no hay ventas/i)).toBeNull()
    expect(container.querySelector('.rounded-xl')).toBeInTheDocument()
  })

  it('muestra el estado vacío sin productos', () => {
    render(<CategoryDonut products={[]} />)
    expect(screen.getByText(/aún no hay ventas/i)).toBeInTheDocument()
  })
})
