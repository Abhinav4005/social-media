import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: ['simple-peer']
  },
  resolve: {
    alias: {
      process: 'process/browser',
      buffer: 'buffer'
    }
  },
  server: {
    allowedHosts: ['dc95f8256a79.ngrok-free.app'],
  },
})
