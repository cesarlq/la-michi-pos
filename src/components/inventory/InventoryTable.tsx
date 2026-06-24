import { InventoryRow } from '@/components/inventory/InventoryRow'
import type { InventoryRow as InventoryRowData } from '@/services/inventoryService'

// Tabla de inventario. Componente de presentación: mapea renglones a InventoryRow.
export function InventoryTable({
  rows,
  branchId,
}: {
  rows: InventoryRowData[]
  branchId?: string
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        No hay productos en esta sucursal.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Producto</th>
            <th className="px-4 py-3 text-center font-medium">Stock</th>
            <th className="px-4 py-3 text-center font-medium">Mínimo</th>
            <th className="px-4 py-3 text-center font-medium">Reabastecer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <InventoryRow key={row.productId} row={row} branchId={branchId} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
