import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Rend la variable d'environnement accessible dans le code client
    // sous `process.env.API_KEY`
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
  }
})