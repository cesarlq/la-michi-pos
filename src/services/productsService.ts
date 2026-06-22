import { apiClient } from '@/lib/apiClient'
import type { ProductCategory } from '@/types/api'

// DTO plano que consume la UI (idéntico al ProductDTO del back).
export type ProductRow = {
  id: string
  name: string
  category: ProductCategory
  price: number
  active: boolean
}

// Producto vendible en el POS: producto activo + stock en esa sucursal.
export type SellableProduct = {
  id: string
  name: string
  category: ProductCategory
  price: number
  stock: number
}

export type ProductFilters = {
  category?: ProductCategory
  search?: string
  active?: boolean
}

// Listado con filtros opcionales.
export async function getProducts(filters: ProductFilters = {}): Promise<ProductRow[]> {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.active !== undefined) params.set('active', String(filters.active))
  const qs = params.toString()
  const rows = await apiClient.get<ProductRow[]>(`/products${qs ? `?${qs}` : ''}`)
  // Filtro de búsqueda por nombre en cliente (el back no lo soporta aún).
  if (filters.search) {
    const q = filters.search.toLowerCase()
    return rows.filter((p) => p.name.toLowerCase().includes(q))
  }
  return rows
}

// Un producto por id (para la pantalla de edición).
export async function getProductById(id: string): Promise<ProductRow | null> {
  try {
    return await apiClient.get<ProductRow>(`/products/${id}`)
  } catch {
    return null
  }
}

// Productos activos con stock para una sucursal (usados por el POS).
export async function getSellableProducts(branchId: string): Promise<SellableProduct[]> {
  return apiClient.get<SellableProduct[]>(`/products/sellable?branch_id=${branchId}`)
}
