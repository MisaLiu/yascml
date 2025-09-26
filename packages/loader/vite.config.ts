import { resolve } from 'node:path';
import { defineConfig } from 'vite'
import dts from 'unplugin-dts/vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src-lib/main.ts'),
      name: 'YASCML',
      fileName: 'yascml',
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      bundleTypes: true
    }),
  ],
})
