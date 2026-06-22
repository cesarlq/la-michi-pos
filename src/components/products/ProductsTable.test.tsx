import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductsTable } from './ProductsTable'
import type { ProductRow } from '@/services/productsService'

// next/link necesita contexto de router; lo reemplazamos por un <a> simple en el test.
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const products: ProductRow[] = [
  { id: '1', name: 'Paleta de fresa', category: 'paleta', price: 25, active: true },
  { id: '2', name: 'Nieve de limón', category: 'nieve', price: 30, active: false },
]

describe('ProductsTable', () => {
  it('muestra los productos con categoría, precio y estado', () => {
    render(<ProductsTable products={products} />)
    expect(screen.getByText('Paleta de fresa')).toBeInTheDocument()
    expect(screen.getByText('Paleta')).toBeInTheDocument()
    expect(screen.getByText('$25.00')).toBeInTheDocument()
    expect(screen.getByText('Activo')).toBeInTheDocument()
    expect(screen.getByText('Inactivo')).toBeInTheDocument()
  })

  it('muestra un mensaje cuando no hay productos', () => {
    render(<ProductsTable products={[]} />)
    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument()
  })

  it('muestra el link "Editar" solo cuando canManage es true', () => {
    const { rerender } = render(<ProductsTable products={products} canManage={false} />)
    expect(screen.queryByText('Editar')).not.toBeInTheDocument()

    rerender(<ProductsTable products={products} canManage />)
    expect(screen.getAllByText('Editar')).toHaveLength(2)
  })
})
