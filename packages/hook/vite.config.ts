import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'YASCHook',
      fileName: (format) => `yaschook${format !== 'iife' ? `.${format}` : ''}.js`,
      formats: [ 'umd', 'iife' ],
    },
  },
}));
