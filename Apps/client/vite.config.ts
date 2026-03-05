import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // SIN rewrite: /api/inventory/categorias → http://localhost:3000/api/inventory/categorias ✅
      }
    }
  }
})

