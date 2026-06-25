import { CATEGORY_LABELS } from '@/constants/products'
import type {
  DailySummary,
  SalesTrendPoint,
  TopProduct,
  CriticalStock,
} from '@/services/reportsService'

// Datos que necesita un reporte exportable. Los arma la página (Server Component)
// y se los pasa al componente de botones.
export type ReportData = {
  summary: DailySummary
  salesTrend: SalesTrendPoint[]
  topProducts: TopProduct[]
  criticalStock: CriticalStock[]
  scope: string // "Todas las sucursales" | "Tu sucursal"
  periodLabel: string // "Última semana" | "2026-06-01 — 2026-06-30" | …
  showBranch: boolean // el dueño ve la columna de sucursal en stock crítico
}

type Row = Record<string, string | number>

const money = (n: number) => Number(n.toFixed(2))
const fileName = (ext: string) => `reporte-lamichi-${new Date().toISOString().slice(0, 10)}.${ext}`

// ── Excel (.xlsx) ──────────────────────────────────────────────────────────
// Un libro con 4 hojas. Calcula el ancho de cada columna según su contenido
// para que no quede todo apretado. Los importes van como número (no string)
// para que Excel pueda sumarlos.
export async function exportReportToExcel(data: ReportData): Promise<void> {
  const XLSX = await import('xlsx')

  const sheetFrom = (rows: Row[]) => {
    const ws = XLSX.utils.json_to_sheet(rows)
    if (rows.length) {
      const keys = Object.keys(rows[0])
      ws['!cols'] = keys.map((k) => {
        const longest = Math.max(k.length, ...rows.map((r) => String(r[k] ?? '').length))
        return { wch: Math.min(Math.max(longest + 2, 12), 40) }
      })
    }
    return ws
  }

  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, sheetFrom([
    { Métrica: 'Periodo', Valor: data.periodLabel },
    { Métrica: 'Alcance', Valor: data.scope },
    { Métrica: 'Ventas del día', Valor: data.summary.saleCount },
    { Métrica: 'Ingresos', Valor: money(data.summary.totalRevenue) },
    { Métrica: 'Unidades vendidas', Valor: data.summary.itemsSold },
  ]), 'Resumen')

  XLSX.utils.book_append_sheet(wb, sheetFrom(
    data.salesTrend.map((p) => ({
      Fecha: p.date,
      Ventas: p.saleCount,
      Ingresos: money(p.totalRevenue),
    })),
  ), 'Tendencia')

  XLSX.utils.book_append_sheet(wb, sheetFrom(
    data.topProducts.map((p) => ({
      Producto: p.productName,
      Categoría: CATEGORY_LABELS[p.category],
      Unidades: p.totalQty,
      Ingresos: money(p.totalRevenue),
    })),
  ), 'Top productos')

  XLSX.utils.book_append_sheet(wb, sheetFrom(
    data.criticalStock.map((s) => ({
      Producto: s.productName,
      Categoría: CATEGORY_LABELS[s.category],
      ...(data.showBranch ? { Sucursal: s.branchName } : {}),
      'Stock actual': s.currentStock,
      'Stock mínimo': s.minStock,
    })),
  ), 'Stock crítico')

  XLSX.writeFile(wb, fileName('xlsx'))
}

// ── PDF ────────────────────────────────────────────────────────────────────
export async function exportReportToPdf(data: ReportData): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default
  const fmt = (n: number) => `$${money(n).toLocaleString('es-MX')}`

  const doc = new jsPDF()
  const ROSE: [number, number, number] = [244, 63, 94]
  const INK: [number, number, number] = [30, 41, 59]
  const finalY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY

  // Encabezado
  doc.setFontSize(18)
  doc.setTextColor(...INK)
  doc.text('La Michi POS — Reportes', 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`${data.scope} · ${data.periodLabel}`, 14, 25)

  // Pequeño helper: dibuja un título de sección y devuelve la Y para la tabla
  const section = (title: string, y: number) => {
    doc.setFontSize(12)
    doc.setTextColor(...INK)
    doc.text(title, 14, y)
    return y + 3
  }

  // Resumen del día
  autoTable(doc, {
    startY: section('Resumen del día', 34),
    body: [
      ['Ventas', String(data.summary.saleCount)],
      ['Ingresos', fmt(data.summary.totalRevenue)],
      ['Unidades vendidas', String(data.summary.itemsSold)],
    ],
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: { 0: { textColor: INK, fontStyle: 'bold' } },
  })

  // Top productos
  autoTable(doc, {
    startY: section('Top productos (últimos 7 días)', finalY() + 12),
    head: [['Producto', 'Categoría', 'Unidades', 'Ingresos']],
    body: data.topProducts.map((p) => [
      p.productName,
      CATEGORY_LABELS[p.category],
      String(p.totalQty),
      fmt(p.totalRevenue),
    ]),
    theme: 'striped',
    headStyles: { fillColor: ROSE },
  })

  // Stock crítico
  const stockHead = data.showBranch
    ? [['Producto', 'Categoría', 'Sucursal', 'Stock', 'Mínimo']]
    : [['Producto', 'Categoría', 'Stock', 'Mínimo']]
  autoTable(doc, {
    startY: section('Stock crítico', finalY() + 12),
    head: stockHead,
    body: data.criticalStock.map((s) =>
      data.showBranch
        ? [s.productName, CATEGORY_LABELS[s.category], s.branchName, String(s.currentStock), String(s.minStock)]
        : [s.productName, CATEGORY_LABELS[s.category], String(s.currentStock), String(s.minStock)],
    ),
    theme: 'striped',
    headStyles: { fillColor: ROSE },
  })

  doc.save(fileName('pdf'))
}
