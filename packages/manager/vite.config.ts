import { resolve } from 'path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.tsx'),
      name: 'YASCManager',
      fileName: (format) => `manager${format !== 'iife' ? `.${format}` : ''}.js`,
      formats: [ 'umd', 'iife' ],
    },
  },
  plugins: [preact()],
})
