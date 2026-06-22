import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CriticalStockTable } from './CriticalStockTable'
import type { CriticalStock } from '@/services/reportsService'

const items: CriticalStock[] = [
  { productId: '1', productName: 'Paleta de fresa', category: 'paleta', branchId: 'b1', branchName: 'Centro', currentStock: 1, minStock: 5 },
  { productId: '2', productName: 'Nieve de limón', category: 'nieve', branchId: 'b1', branchName: 'Centro', currentStock: 0, minStock: 3 },
]

describe('CriticalStockTable', () => {
  it('muestra los productos con stock bajo y su mínimo', () => {
    render(<CriticalStockTable items={items} />)
    expect(screen.getByText('Paleta de fresa')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('oculta la columna de sucursal por defecto y la muestra con showBranch', () => {
    const { rerender } = render(<CriticalStockTable items={items} />)
    expect(screen.queryByText('Sucursal')).not.toBeInTheDocument()

    rerender(<CriticalStockTable items={items} showBranch />)
    expect(screen.getByText('Sucursal')).toBeInTheDocument()
    expect(screen.getAllByText('Centro')).toHaveLength(2)
  })

  it('muestra mensaje positivo cuando no hay stock crítico', () => {
    render(<CriticalStockTable items={[]} />)
    expect(screen.getByText(/por encima del mínimo/i)).toBeInTheDocument()
  })
})
