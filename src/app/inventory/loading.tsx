import { InventorySkeleton } from '@/components/inventory/InventorySkeleton'

export default function Loading() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
      <InventorySkeleton />
    </main>
  )
}
