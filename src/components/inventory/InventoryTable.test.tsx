import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InventoryTable } from './InventoryTable'
import type { InventoryRow } from '@/services/inventoryService'

// Las actions tocan el servidor; las mockeamos para poder renderizar las filas.
vi.mock('@/actions/inventory.actions', () => ({
  restockProduct: vi.fn(),
  setMinStock: vi.fn(),
}))

const rows: InventoryRow[] = [
  { productId: '1', productName: 'Paleta de fresa', category: 'paleta', price: 25, currentStock: 8, minStock: 2 },
  { productId: '2', productName: 'Nieve de limón', category: 'nieve', price: 30, currentStock: 1, minStock: 5 },
]

describe('InventoryTable', () => {
  it('muestra los productos con su stock', () => {
    render(<InventoryTable rows={rows} />)
    expect(screen.getByText('Paleta de fresa')).toBeInTheDocument()
    expect(screen.getByText('Nieve de limón')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('resalta el stock crítico (≤ mínimo)', () => {
    render(<InventoryTable rows={rows} />)
    // Nieve tiene stock 1 ≤ min 5 → badge ámbar
    const criticalCell = screen.getByText('1')
    expect(criticalCell.className).toContain('amber')
  })

  it('expone controles de reabastecer y mínimo por producto', () => {
    render(<InventoryTable rows={rows} />)
    expect(screen.getByLabelText('Reabastecer Paleta de fresa')).toBeInTheDocument()
    expect(screen.getByLabelText('Mínimo de Paleta de fresa')).toBeInTheDocument()
  })

  it('muestra un mensaje cuando no hay productos', () => {
    render(<InventoryTable rows={[]} />)
    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument()
  })
})
