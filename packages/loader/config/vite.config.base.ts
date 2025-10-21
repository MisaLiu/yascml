import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const packageJsonPath = resolve(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' })) as { version: string };

export default defineConfig(({ mode }) => ({
  define: {
    '__LOADER_VERSION__': JSON.stringify(packageJson.version),
    '__DEVELOPMENT__': JSON.stringify(mode !== 'production'),
  },
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    target: 'es6',
    lib: {
      entry: resolve(__dirname, '../src/main.ts'),
      name: 'YASCML',
      fileName: () => 'yascml.js',
      formats: [ 'umd' ],
    },
    rollupOptions: {
      output: {
        globals: {
          'jszip': 'JSZip',
          'idb-keyval': 'idbKeyval',
        },
      }
    },
  }
}));
