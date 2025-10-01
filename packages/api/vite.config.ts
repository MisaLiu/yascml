import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'YASCAPI',
      fileName: (format) => `yascapi${format !== 'iife' ? `.${format}` : ''}.js`,
      formats: [ 'umd', 'iife' ],
    },
  },
});
