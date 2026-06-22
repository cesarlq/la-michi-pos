import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductForm } from './ProductForm'

describe('ProductForm', () => {
  it('renderiza los campos nombre, categoría y precio + botón', () => {
    render(<ProductForm action={vi.fn()} submitLabel="Guardar producto" />)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Categoría')).toBeInTheDocument()
    expect(screen.getByLabelText('Precio (MXN)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /guardar producto/i })).toBeInTheDocument()
  })

  it('precarga los valores en edición (defaultValues)', () => {
    render(
      <ProductForm
        action={vi.fn()}
        defaultValues={{ id: 'abc', name: 'Paleta de coco', category: 'paleta', price: 25 }}
        submitLabel="Guardar cambios"
      />,
    )
    expect(screen.getByLabelText('Nombre')).toHaveValue('Paleta de coco')
    expect(screen.getByLabelText('Precio (MXN)')).toHaveValue(25)
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument()
  })
})
