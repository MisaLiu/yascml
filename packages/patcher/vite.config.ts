import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { prependShebang } from 'vite-plugin-shebang';
import { version, dependencies } from './package.json';

export default defineConfig(({ mode }) => ({
  define: {
    '__PATCHER_VERSION__': JSON.stringify(version),
  },
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/main.ts'),
        cli: resolve(__dirname, 'src/bin/cli.ts'),
      },
      name: 'YASCPatcher',
      formats: [ 'es', 'cjs' ],
    },
    rollupOptions: {
      external: [
        ...Object.keys(dependencies),
        'fs',
        'fs/promises',
        'path',
        'util',
        'assert',
        'assert',
        'stream',
        'constants'
      ],
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      copyDtsFiles: true,
      bundleTypes: true
    }),
    prependShebang({
      shebang: '#!/usr/bin/env node',
      files: [ 'cli.cjs', 'cli.js' ]
    }),
  ],
}));
