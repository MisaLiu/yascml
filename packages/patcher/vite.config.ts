import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { dependencies } from './package.json';

const packageJsonPath = resolve(__dirname, './package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' })) as { version: string };

export default defineConfig(({ mode }) => ({
  define: {
    '__LOADER_VERSION__': JSON.stringify(packageJson.version),
  },
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
