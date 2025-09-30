/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'backup/**',
      '.git/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/tests/setup.ts',
        'src/**/*.d.ts',
        'src/**/*.stories.{js,ts,jsx,tsx}',
        'src/**/*.config.{js,ts}',
        'backup/**'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    testTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    }
  },
  server: {
    port: 8081,
    host: true
  }
} as any)