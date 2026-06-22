import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoginForm } from './LoginForm'

// La acción real importa Prisma/bcrypt; la mockeamos para probar el componente AISLADO.
vi.mock('@/actions/auth.actions', () => ({
  authenticate: vi.fn(),
}))

describe('LoginForm', () => {
  it('renderiza el título, los campos y el botón', () => {
    render(<LoginForm />)
    expect(screen.getByRole('heading', { name: /La Michi POS/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('los campos son obligatorios y del tipo correcto', () => {
    render(<LoginForm />)
    const email = screen.getByLabelText('Correo')
    const password = screen.getByLabelText('Contraseña')
    expect(email).toHaveAttribute('type', 'email')
    expect(email).toBeRequired()
    expect(password).toHaveAttribute('type', 'password')
    expect(password).toBeRequired()
  })

  it('no muestra ningún error al cargar', () => {
    render(<LoginForm />)
    expect(screen.queryByText(/incorrectos/i)).not.toBeInTheDocument()
  })
})
