import Link from 'next/link'
import { requireRole } from '@/lib/auth-guards'
import { createProduct } from '@/actions/products.actions'
import { ProductForm } from '@/components/products/ProductForm'

// 🔒 Gate de rol a nivel PÁGINA: solo el dueño puede entrar a crear.
// (La action repite el check — defensa en profundidad.)
export default async function NewProductPage() {
  await requireRole('owner')

  return (
    <main className="mx-auto max-w-md p-6">
      <Link href="/products" className="text-sm text-gray-500 hover:text-gray-700">
        ← Volver a productos
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">Nuevo producto</h1>
      <ProductForm action={createProduct} submitLabel="Guardar producto" />
    </main>
  )
}
