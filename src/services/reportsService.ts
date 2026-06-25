import { apiClient } from '@/lib/apiClient'
import type { ProductCategory } from '@/types/api'

// DTOs — espejo de los que devuelve el backend Go (reportsapi).

export type DailySummary = {
  date: string
  saleCount: number
  totalRevenue: number
  itemsSold: number
}

export type SalesTrendPoint = {
  date: string // YYYY-MM-DD
  saleCount: number
  totalRevenue: number
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

// Rango de fechas del periodo a consultar (YYYY-MM-DD). Vacío = default del back.
export type RangeParams = { from?: string; to?: string }

// El back resuelve la sucursal según el rol del JWT (managers ven solo la suya,
// owners ven todo o filtran con branchId). Aquí solo reenviamos el filtro opcional.
function branchQuery(branchId?: string): string {
  return branchId ? `&branch_id=${branchId}` : ''
}

function rangeQuery({ from, to }: RangeParams): string {
  return from && to ? `from=${from}&to=${to}` : ''
}

export async function getSummary(
  range: RangeParams = {},
  branchId?: string,
): Promise<DailySummary> {
  return apiClient.get<DailySummary>(
    `/reports/summary?${rangeQuery(range)}${branchQuery(branchId)}`,
  )
}

export async function getSalesTrend(
  range: RangeParams = {},
  branchId?: string,
): Promise<SalesTrendPoint[]> {
  return apiClient.get<SalesTrendPoint[]>(
    `/reports/sales-trend?${rangeQuery(range)}${branchQuery(branchId)}`,
  )
}

export async function getTopProducts(
  range: RangeParams = {},
  limit = 10,
  branchId?: string,
): Promise<TopProduct[]> {
  return apiClient.get<TopProduct[]>(
    `/reports/top-products?${rangeQuery(range)}&limit=${limit}${branchQuery(branchId)}`,
  )
}

export async function getCriticalStock(branchId?: string): Promise<CriticalStock[]> {
  return apiClient.get<CriticalStock[]>(`/reports/critical-stock?${branchQuery(branchId).slice(1)}`)
}
