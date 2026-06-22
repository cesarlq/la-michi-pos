import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopProductsList } from './TopProductsList'
import type { TopProduct } from '@/services/reportsService'

const products: TopProduct[] = [
  { productId: '1', productName: 'Paleta de fresa', category: 'paleta', totalQty: 30, totalRevenue: 450 },
  { productId: '2', productName: 'Nieve de vainilla', category: 'nieve', totalQty: 20, totalRevenue: 400 },
]

describe('TopProductsList', () => {
  it('muestra el ranking con cantidad e ingresos', () => {
    render(<TopProductsList products={products} />)
    expect(screen.getByText('Paleta de fresa')).toBeInTheDocument()
    expect(screen.getByText('30 u.')).toBeInTheDocument()
    expect(screen.getByText('$450.00')).toBeInTheDocument()
    expect(screen.getByText('Paleta')).toBeInTheDocument()
  })

  it('numera los productos en orden', () => {
    render(<TopProductsList products={products} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('muestra un mensaje cuando no hay ventas', () => {
    render(<TopProductsList products={[]} />)
    expect(screen.getByText(/aún no hay ventas/i)).toBeInTheDocument()
  })
})
