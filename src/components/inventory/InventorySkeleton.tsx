// Skeleton de carga del inventario. Pulso de Tailwind, sin lógica.
export function InventorySkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-10 rounded-t-xl border border-gray-200 bg-gray-100" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 rounded border border-gray-200 bg-gray-50" />
      ))}
    </div>
  )
}
