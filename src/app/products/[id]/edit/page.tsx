import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth-guards'
import { getProductById } from '@/services/productsService'
import { updateProduct, setProductActive } from '@/actions/products.actions'
import { ProductForm } from '@/components/products/ProductForm'

// 🔒 Solo el dueño edita. Carga el producto y rellena el form.
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('owner')
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <main className="mx-auto max-w-md p-6">
      <Link href="/products" className="text-sm text-gray-500 hover:text-gray-700">
        ← Volver a productos
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">Editar producto</h1>

      <ProductForm action={updateProduct} defaultValues={product} submitLabel="Guardar cambios" />

      {/* Activar / Desactivar (baja lógica). bind() le pasa el id y el nuevo estado a la action. */}
      <form action={setProductActive.bind(null, product.id, !product.active)} className="mt-6 border-t border-gray-200 pt-6">
        <button type="submit" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          {product.active ? 'Desactivar producto' : 'Activar producto'}
        </button>
      </form>
    </main>
  )
}
