import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  css: {
    devSourcemap: true
  }
})
