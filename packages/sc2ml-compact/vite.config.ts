import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import cp from 'vite-plugin-cp';
import zipPack from 'vite-plugin-zip-pack';
import { version } from './package.json';

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SC2MLCompact',
      fileName: (format) => `sc2ml-compact${format !== 'iife' ? `.${format}` : ''}.js`,
      formats: [ 'iife' ],
    },
  },
  plugins: [
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
