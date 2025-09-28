import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

const packageJsonPath = resolve(__dirname, './package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' })) as { version: string };

export default defineConfig({
  define: {
    '__LOADER_VERSION__': JSON.stringify(packageJson.version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'YASCML',
      fileName: (format) => `yascml${format !== 'iife' ? `.${format}` : ''}.js`,
      formats: [ 'umd', 'iife' ],
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      bundleTypes: true
    }),
  ],
});
