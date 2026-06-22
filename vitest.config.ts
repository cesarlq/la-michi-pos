import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // react() → entiende JSX. tsconfigPaths() → resuelve el alias '@/*' en los tests.
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom', // simula el navegador (document, window) para probar componentes
    globals: true, // describe/it/expect disponibles sin importar
    setupFiles: ['./vitest.setup.ts'],
  },
})
