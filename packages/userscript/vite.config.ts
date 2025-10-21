import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import monkey, { cdn } from 'vite-plugin-monkey';
import DepInfo from '../loader/dist/deps.json'; // LOL

const dependencies = DepInfo.dependencies as Record<string, { version: string, global: string, path: string }>;

export default defineConfig(({ mode }) => {
  const externalRequire: string[] = [];

  for (const name in dependencies) {
    const { path, version } = dependencies[name];
    const [ , generate ] = cdn.jsdelivr(name, path);
    externalRequire.push(generate(version, name));
  }

  return ({
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
          'require': externalRequire,
          'run-at': 'document-start',
          'sandbox': 'raw',
          'grant': 'none',
        },
        generate: ({ userscript }) => ([
            userscript,
            '',
            '// You need to define websites you want to run',
            '// Add/remove/change the `@match` section above!',
            '',
            '// You can define your custom YASCML config here:',
            'window.YASCMLConfig = {};',
            '',
            '// For full sources please go: https://github.com/yascml/yascml/blob/main/packages/userscript',
          ].join('\n')),
        build: {
          fileName: 'yascml.user.js',
          externalGlobals: {
            'acorn': cdn.jsdelivr('acorn', 'dist/acorn.js'),
            'acorn-walk': cdn.jsdelivr('acorn.walk', 'dist/walk.js'),
            'astring': cdn.jsdelivr('astring', 'dist/astring.min.js'),
          },
        },
      })
    ],
  });
});
