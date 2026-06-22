const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

// Formatea un número como moneda mexicana: 25 → "$25.00".
export function formatCurrency(amount: number): string {
  return mxn.format(amount)
}
