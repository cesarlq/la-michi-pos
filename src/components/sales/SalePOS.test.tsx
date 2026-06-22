import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SalePOS } from './SalePOS'
import type { SellableProduct } from '@/services/salesService'

// createSale toca Prisma; useRouter necesita contexto de Next. Mockeamos ambos.
vi.mock('@/actions/sales.actions', () => ({ createSale: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

const products: SellableProduct[] = [
  { id: '1', name: 'Paleta de fresa', category: 'paleta', price: 25, stock: 10 },
  { id: '2', name: 'Nieve de limón', category: 'nieve', price: 30, stock: 0 },
]

describe('SalePOS', () => {
  it('agrega un producto al carrito y actualiza el total', async () => {
    const user = userEvent.setup()
    render(<SalePOS branchId="b1" branchName="Centro" products={products} />)

    expect(screen.getByRole('button', { name: /Cobrar/ })).toHaveTextContent('$0.00')
    await user.click(screen.getByRole('button', { name: /Paleta de fresa/ }))
    expect(screen.getByRole('button', { name: /Cobrar/ })).toHaveTextContent('$25.00')
  })

  it('deshabilita los productos sin stock', () => {
    render(<SalePOS branchId="b1" branchName="Centro" products={products} />)
    expect(screen.getByRole('button', { name: /Nieve de limón/ })).toBeDisabled()
  })
})
