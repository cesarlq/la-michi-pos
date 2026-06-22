import type { UserRole } from '@/types/api'

export type NavModule = {
  label: string
  description: string
  href: string
  roles: UserRole[] // qué roles pueden ver/usar este módulo
  available: boolean // false = aún no construido ("Próximamente")
  emoji: string
}

// Catálogo central de módulos de la app. El dashboard filtra por el rol del usuario.
export const MODULES: NavModule[] = [
  {
    label: 'Punto de venta',
    description: 'Registrar una venta',
    href: '/sales/new',
    roles: ['owner', 'manager', 'employee'],
    available: true,
    emoji: '🛒',
  },
  {
    label: 'Productos',
    description: 'Catálogo de paletas, nieves y aguas',
    href: '/products',
    roles: ['owner', 'manager', 'employee'],
    available: true,
    emoji: '🍦',
  },
  {
    label: 'Inventario',
    description: 'Stock por sucursal',
    href: '/inventory',
    roles: ['owner', 'manager'],
    available: true,
    emoji: '📦',
  },
  {
    label: 'Reportes',
    description: 'Ventas del día, top sabores y stock crítico',
    href: '/reports',
    roles: ['owner', 'manager'],
    available: true,
    emoji: '📊',
  },
  {
    label: 'Sucursales',
    description: 'Administrar las paleterías',
    href: '/branches',
    roles: ['owner'],
    available: true,
    emoji: '🏪',
  },
  {
    label: 'Usuarios',
    description: 'Administrar empleados y roles',
    href: '/users',
    roles: ['owner'],
    available: true,
    emoji: '👥',
  },
]

// Devuelve solo los módulos que el rol puede ver.
export function modulesForRole(role: UserRole): NavModule[] {
  return MODULES.filter((m) => m.roles.includes(role))
}
