import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePointOfSale } from './usePointOfSale'
import type { SellableProduct } from '@/services/salesService'

vi.mock('@/actions/sales.actions', () => ({ createSale: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

const fresa: SellableProduct = { id: '1', name: 'Paleta de fresa', category: 'paleta', price: 25, stock: 10 }

describe('usePointOfSale', () => {
  it('agrega items y calcula el total', () => {
    const { result } = renderHook(() => usePointOfSale('b1'))
    expect(result.current.total).toBe(0)

    act(() => result.current.add(fresa))
    expect(result.current.total).toBe(25)

    act(() => result.current.add(fresa))
    expect(result.current.total).toBe(50)
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('no deja exceder el stock disponible (espejo de UX)', () => {
    const { result } = renderHook(() => usePointOfSale('b1'))
    const limitado: SellableProduct = { ...fresa, stock: 1 }

    act(() => result.current.add(limitado))
    act(() => result.current.add(limitado)) // intenta agregar otro
    expect(result.current.items[0].quantity).toBe(1) // capado a stock
  })

  it('quita el item cuando la cantidad llega a 0', () => {
    const { result } = renderHook(() => usePointOfSale('b1'))
    act(() => result.current.add(fresa))
    act(() => result.current.setQuantity('1', 0))
    expect(result.current.items).toHaveLength(0)
  })
})
