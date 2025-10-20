import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import monkey, { cdn } from 'vite-plugin-monkey';

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    target: 'es6',
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'YASCML UserScript',
      fileName: () => `yascml.user.js`,
      formats: [ 'umd' ],
    },
    rollupOptions: {
      output: {
        globals: {
          'acorn': 'acorn',
          'acorn-walk': 'acorn.walk',
          'astring': 'astring',
        },
      }
    },
  },
  plugins: [
    monkey({
      entry: resolve(__dirname, 'src/main.js'),
      userscript: {
        'name': 'YASCML',
        'namespace': 'yascml',
        'description': 'Yet Another SugarCube Mod Loader',
        'author': 'Misa Liu',
        'match': [
          // Note that we can't load this into editor's test/preview game,
          // this is just for a demonstration
          'https://twinery.org/2*',
        ],
        'run-at': 'document-start',
        'sandbox': 'raw',
        'grant': 'none',
      },
      build: {
        fileName: 'yascml.user.js',
        externalGlobals: {
          acorn: cdn.jsdelivr('acorn', 'dist/acorn.js'),
          'acorn-walk': cdn.jsdelivr('acorn-walk', 'dist/walk.js'),
          astring: cdn.jsdelivr('astring', 'dist/astring.min.js'),
        },
      },
    })
  ],
}));
