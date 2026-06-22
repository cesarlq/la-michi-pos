import { apiClient } from '@/lib/apiClient'
import type { ProductCategory } from '@/types/api'

// DTOs — espejo de los que devuelve el backend Go (reportsapi).

export type DailySummary = {
  date: string
  saleCount: number
  totalRevenue: number
  itemsSold: number
}

export type TopProduct = {
  productId: string
  productName: string
  category: ProductCategory
  totalQty: number
  totalRevenue: number
}

export type CriticalStock = {
  productId: string
  productName: string
  category: ProductCategory
  branchId: string
  branchName: string
  currentStock: number
  minStock: number
}

// El back resuelve la sucursal según el rol del JWT (managers ven solo la suya,
// owners ven todo o filtran con branchId). Aquí solo reenviamos el filtro opcional.
function branchQuery(branchId?: string): string {
  return branchId ? `&branch_id=${branchId}` : ''
}

export async function getDailySummary(date?: string, branchId?: string): Promise<DailySummary> {
  const dateParam = date ? `date=${date}` : ''
  return apiClient.get<DailySummary>(`/reports/daily?${dateParam}${branchQuery(branchId)}`)
}

export async function getTopProducts(
  days = 7,
  limit = 10,
  branchId?: string,
): Promise<TopProduct[]> {
  return apiClient.get<TopProduct[]>(
    `/reports/top-products?days=${days}&limit=${limit}${branchQuery(branchId)}`,
  )
}

export async function getCriticalStock(branchId?: string): Promise<CriticalStock[]> {
  return apiClient.get<CriticalStock[]>(`/reports/critical-stock?${branchQuery(branchId).slice(1)}`)
}
