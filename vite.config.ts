import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Enable esbuild polyfill for Node.js globals
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    port: 8080,
    open: true,
    host: true,
    strictPort: false
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
