import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // O CORS do backend só libera http://localhost:5173. Com strictPort, se a 5173
    // estiver ocupada o Vite avisa em vez de subir em outra porta (que a API bloquearia).
    port: 5173,
    strictPort: true,
  },
})
