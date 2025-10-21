import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

const packageJsonPath = resolve(__dirname, './package.json');
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
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'YASCML',
      fileName: (format) => `yascml${format !== 'umd' ? `.${format}` : ''}.js`,
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
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      copyDtsFiles: true,
      insertTypesEntry: true,
    }),
  ],
}));
