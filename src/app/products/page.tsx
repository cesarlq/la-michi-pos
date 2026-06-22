import Link from 'next/link'
import type { ProductCategory } from '@/types/api'
import { requireAuth } from '@/lib/auth-guards'
import { getProducts } from '@/services/productsService'
import { CATEGORIES } from '@/constants/products'
import { ProductsTable } from '@/components/products/ProductsTable'
import { ProductsFilters } from '@/components/products/ProductsFilters'

// Server Component: valida sesión, lee el filtro de la URL, pide datos y arma la vista.
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const user = await requireAuth()
  const { category } = await searchParams

  const validCategory = CATEGORIES.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : undefined

  const products = await getProducts({ category: validCategory })
  const canManage = user.role === 'owner' // solo el dueño gestiona productos

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Inicio
      </Link>

      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        {canManage && (
          <Link
            href="/products/new"
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            + Nuevo producto
          </Link>
        )}
      </div>

      <div className="mb-4">
        <ProductsFilters active={validCategory} />
      </div>

      <ProductsTable products={products} canManage={canManage} />
    </main>
  )
}
