import { resolve } from 'path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import cp from 'vite-plugin-cp';
import zipPack from 'vite-plugin-zip-pack'
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.tsx'),
      name: 'YASCManager',
      fileName: (format) => `manager${format !== 'iife' ? `.${format}` : ''}.js`,
      formats: [ 'iife' ],
    },
  },
  plugins: [
    preact(),
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
      outFileName: 'yascmanager.zip',
    }),
  ],
})
