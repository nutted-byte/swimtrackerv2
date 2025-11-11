import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - run `npm run build` to generate stats.html
    visualizer({
      open: false, // Set to true to auto-open after build
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ],
  server: {
    port: 3000,
    host: '0.0.0.0', // Listen on all network interfaces
    open: true
  },
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    // Chunk splitting strategy for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'chart-vendor': ['recharts'],
          'supabase-vendor': ['@supabase/supabase-js'],
          // Analytics utilities
          'analytics': [
            './src/utils/analytics.js',
            './src/utils/analytics/deepAnalysis.js',
            './src/utils/analytics/patternRecognition.js',
            './src/utils/analytics/anomalyDetection.js'
          ]
        }
      }
    },
    // Target modern browsers for smaller bundle
    target: 'esnext',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size warning limit (recharts is large)
    chunkSizeWarningLimit: 1000,
    // Enable source maps only for debugging (disable for production)
    sourcemap: false
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'framer-motion',
      'recharts'
    ]
  }
})
