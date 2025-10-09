import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import cp from 'vite-plugin-cp';
import zipPack from 'vite-plugin-zip-pack';
import { version } from './package.json';

export default defineConfig(({ mode }) => ({
  define: {
    __VERSION__: JSON.stringify(version),
  },
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    lib: {
      entry: {
        preload: resolve(__dirname, 'src/main.ts'),
        postload: resolve(__dirname, 'src/postload.ts'),
      },
      name: 'SC2MLCompact',
      fileName: (format, name) => `${name}${format !== 'cjs' ? `.${format}` : ''}.js`,
      formats: [ 'cjs' ],
    },
    rollupOptions: {
      external: [ 'idb-keyval' ],
      output: {
        exports: 'named',
        globals: {
          'idb': 'idb',
          'idb-keyval': 'idbKeyval',
          lodash: 'lodash',
        },
      },
    },
  },
  plugins: [
    {
      name: 'wrap-cjs-iife',
      generateBundle(options, bundle) {
        if (options.format !== 'cjs') return;
        for (const [, chunk ] of Object.entries(bundle)) {
          if (chunk.type === 'chunk') {
            chunk.code = `(function(){${chunk.code}})();`;
          }
        }
      }
    },
    cp({
      targets: [
        {
          src: resolve(__dirname, './meta.json'), dest: resolve(__dirname, './dist'), 
          transform(buf) {
            const meta = JSON.parse(buf.toString());
            return JSON.stringify({
              ...meta,
              version,
            });
          }
        }
      ],
    }),
    zipPack({
      inDir: resolve(__dirname, './dist'),
      outDir: resolve(__dirname, './dist'),
      outFileName: 'sc2ml-compact.zip',
    }),
  ],
}));
