// Tipos del dominio local — reemplazan los imports de @prisma/client.
// Deben mantenerse en sincronía con los enums del backend Go.

export type ProductCategory = 'paleta' | 'nieve' | 'agua_fresca' | 'otro'
export type PaymentMethod = 'cash' | 'card' | 'transfer'
export type UserRole = 'owner' | 'manager' | 'employee'
