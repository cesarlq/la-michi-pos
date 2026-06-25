'use client'

import { useState } from 'react'
import { exportReportToExcel, exportReportToPdf, type ReportData } from '@/lib/reportExport'

// Botones de descarga del reporte. Componente puro: recibe los datos por props
// y delega la generación del archivo al util reportExport.
export function ExportButtons({ data }: { data: ReportData }) {
  const [busy, setBusy] = useState<'excel' | 'pdf' | null>(null)

  async function run(kind: 'excel' | 'pdf') {
    setBusy(kind)
    try {
      if (kind === 'excel') await exportReportToExcel(data)
      else await exportReportToPdf(data)
    } finally {
      setBusy(null)
    }
  }

  const base =
    'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:opacity-50'

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => run('excel')}
        disabled={busy !== null}
        className={`${base} border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
      >
        {busy === 'excel' ? 'Generando…' : 'Excel'}
      </button>
      <button
        type="button"
        onClick={() => run('pdf')}
        disabled={busy !== null}
        className={`${base} border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`}
      >
        {busy === 'pdf' ? 'Generando…' : 'PDF'}
      </button>
    </div>
  )
}
