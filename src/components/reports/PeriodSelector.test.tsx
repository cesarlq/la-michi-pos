import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PeriodSelector } from './PeriodSelector'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

describe('PeriodSelector', () => {
  beforeEach(() => vi.clearAllMocks())

  it('muestra los presets', () => {
    render(<PeriodSelector active="week" />)
    expect(screen.getByRole('button', { name: 'Semana' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Año' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Personalizado' })).toBeInTheDocument()
  })

  it('navega al seleccionar un preset', async () => {
    render(<PeriodSelector active="week" />)
    await userEvent.click(screen.getByRole('button', { name: 'Mes' }))
    expect(push).toHaveBeenCalledWith('/reports?period=month')
  })

  it('aplica un rango personalizado', async () => {
    render(<PeriodSelector active="week" />)
    await userEvent.click(screen.getByRole('button', { name: 'Personalizado' }))
    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-06-01' } })
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '2026-06-30' } })
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(push).toHaveBeenCalledWith('/reports?period=custom&from=2026-06-01&to=2026-06-30')
  })
})
