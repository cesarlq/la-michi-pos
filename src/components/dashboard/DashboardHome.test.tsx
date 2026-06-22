import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardHome } from './DashboardHome'
import type { NavModule } from '@/constants/navigation'

// logout importa auth.ts (Prisma); next/link necesita router. Mockeamos ambos para aislar.
vi.mock('@/actions/auth.actions', () => ({ logout: vi.fn() }))
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const modules: NavModule[] = [
  { label: 'Productos', description: 'Catálogo', href: '/products', roles: ['owner'], available: true, emoji: '🍦' },
  { label: 'Reportes', description: 'Ventas', href: '/reports', roles: ['owner'], available: false, emoji: '📊' },
]

describe('DashboardHome', () => {
  it('muestra el saludo, el rol traducido y la sucursal', () => {
    render(<DashboardHome name="César" role="owner" branchName={null} modules={modules} />)
    expect(screen.getByText(/Hola, César/)).toBeInTheDocument()
    expect(screen.getByText('Dueño')).toBeInTheDocument()
    expect(screen.getByText('Todas las sucursales')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()
  })

  it('lista los módulos: los disponibles y los próximos con su badge', () => {
    render(<DashboardHome name="Ana" role="owner" branchName="La Michi Centro" modules={modules} />)
    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
    expect(screen.getByText('Próximamente')).toBeInTheDocument()
    expect(screen.getByText('La Michi Centro')).toBeInTheDocument()
  })
})
