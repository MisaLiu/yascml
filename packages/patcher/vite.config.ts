import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { dependencies } from './package.json';

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'YASCPatcher',
      fileName: 'patcher',
      formats: [ 'es', 'cjs' ],
    },
    rollupOptions: {
      external: Object.keys(dependencies),
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      copyDtsFiles: true,
      bundleTypes: true
    }),
  ],
}));
