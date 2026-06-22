import { getToken } from '@/lib/session'

// Error tipado para que las pages/actions puedan distinguir errores HTTP.
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const API_URL = process.env.API_URL

if (!API_URL) throw new Error('API_URL no está definida en las variables de entorno.')

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = await getToken()

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(res.status, (payload as { error?: string }).error ?? 'Error desconocido')
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
