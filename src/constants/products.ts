import type { ProductCategory } from '@/types/api'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  paleta: 'Paleta',
  nieve: 'Nieve',
  agua_fresca: 'Agua fresca',
  otro: 'Otro',
}

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[]
