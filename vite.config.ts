import { defineConfig } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
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
      // Production optimizations
      target: 'es2018',
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          // Chunk splitting for better caching
          manualChunks: {
            vendor: ['react', 'react-dom'],
            three: ['three', '@react-three/fiber', '@react-three/drei'],
            charts: ['chart.js', 'react-chartjs-2', 'recharts'],
            pdf: ['jspdf', 'jspdf-autotable'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-slider', '@radix-ui/react-switch']
          },
          // Asset file naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      // Build size optimizations
      chunkSizeWarningLimit: 1000,
      assetsInlineLimit: 4096
    },
    // Define environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __IS_PRODUCTION__: isProduction
    }
  }
})
