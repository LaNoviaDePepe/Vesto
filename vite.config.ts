import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    visualizer({
      open: true,
      filename: "bundle-stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Esta función divide las librerías en archivos independientes
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Creamos un archivo solo para Recharts
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            // Creamos un archivo solo para Supabase
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Creamos un archivo para los iconos de Lucide
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            // El resto de librerías pequeñas irán en un chunk común de librerías
            return 'vendor';
          }
        },
      },
    },
    // Opcional: aumenta un poco el límite de advertencia si prefieres no ver el aviso amarillo
    chunkSizeWarningLimit: 600,
  },
})