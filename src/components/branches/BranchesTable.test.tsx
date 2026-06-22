import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BranchesTable } from './BranchesTable'
import type { Branch } from '@/services/branchesService'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

const branches: Branch[] = [
  { id: '1', name: 'Centro', address: 'Av. Juárez 123', phone: '5511', active: true },
  { id: '2', name: 'Norte', address: null, phone: null, active: false },
]

describe('BranchesTable', () => {
  it('muestra las sucursales con su estado', () => {
    render(<BranchesTable branches={branches} />)
    expect(screen.getByText('Centro')).toBeInTheDocument()
    expect(screen.getByText('Av. Juárez 123')).toBeInTheDocument()
    expect(screen.getByText('Activa')).toBeInTheDocument()
    expect(screen.getByText('Inactiva')).toBeInTheDocument()
  })

  it('muestra un guion cuando no hay teléfono', () => {
    render(<BranchesTable branches={branches} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('muestra mensaje cuando no hay sucursales', () => {
    render(<BranchesTable branches={[]} />)
    expect(screen.getByText(/no hay sucursales/i)).toBeInTheDocument()
  })
})
