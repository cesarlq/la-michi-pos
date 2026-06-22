import Link from 'next/link'
import { CATEGORY_LABELS, CATEGORIES } from '@/constants/products'
import type { ProductCategory } from '@/types/api'

// Filtro por categoría con links (cambia el ?category= de la URL → re-fetch SSR en la page).
// Es Server Component: no necesita JS de cliente, solo navegación de Next.
export function ProductsFilters({ active }: { active?: ProductCategory }) {
  const pill = 'rounded-full px-3 py-1 text-sm transition'
  const on = 'bg-rose-600 text-white'
  const off = 'bg-gray-100 text-gray-700 hover:bg-gray-200'

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/products" className={`${pill} ${!active ? on : off}`}>
        Todas
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={`/products?category=${cat}`}
          className={`${pill} ${active === cat ? on : off}`}
        >
          {CATEGORY_LABELS[cat]}
        </Link>
      ))}
    </div>
  )
}
