// Skeleton de carga de la vista de reportes. Pulso de Tailwind, sin lógica.
export function ReportsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Tarjetas de resumen */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-gray-200 bg-gray-100" />
        ))}
      </div>

      {/* Top productos */}
      <div className="space-y-3">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="h-48 rounded-xl border border-gray-200 bg-gray-100" />
      </div>

      {/* Stock crítico */}
      <div className="space-y-3">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="h-40 rounded-xl border border-gray-200 bg-gray-100" />
      </div>
    </div>
  )
}
