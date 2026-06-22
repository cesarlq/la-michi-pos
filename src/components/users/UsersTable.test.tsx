import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UsersTable } from './UsersTable'
import type { UserRow } from '@/services/usersService'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

const users: UserRow[] = [
  { id: '1', name: 'César', email: 'dueno@lamichi.com', role: 'owner', branchId: null, active: true },
  { id: '2', name: 'Ana', email: 'ana@lamichi.com', role: 'manager', branchId: 'b1', active: false },
]

const branchNames = { b1: 'Centro' }

describe('UsersTable', () => {
  it('muestra los usuarios con su rol traducido', () => {
    render(<UsersTable users={users} branchNames={branchNames} />)
    expect(screen.getByText('César')).toBeInTheDocument()
    expect(screen.getByText('Dueño')).toBeInTheDocument()
    expect(screen.getByText('Encargado')).toBeInTheDocument()
  })

  it('muestra "Todas" para owner sin sucursal y el nombre para los demás', () => {
    render(<UsersTable users={users} branchNames={branchNames} />)
    expect(screen.getByText('Todas')).toBeInTheDocument()
    expect(screen.getByText('Centro')).toBeInTheDocument()
  })

  it('refleja el estado activo/inactivo', () => {
    render(<UsersTable users={users} branchNames={branchNames} />)
    expect(screen.getByText('Activo')).toBeInTheDocument()
    expect(screen.getByText('Inactivo')).toBeInTheDocument()
  })

  it('muestra mensaje cuando no hay usuarios', () => {
    render(<UsersTable users={[]} branchNames={{}} />)
    expect(screen.getByText(/no hay usuarios/i)).toBeInTheDocument()
  })
})
