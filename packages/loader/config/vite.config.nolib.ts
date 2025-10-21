import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { coerce, valid } from 'semver';
import BaseConfig from './vite.config.base';

type DependencyInfo = {
  version: string,
  global: string,
  path: string,
};

const packageJsonPath = resolve(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' })) as { dependencies: Record<string, string> };

const ExternalDeps = [
  'jszip',
  'idb-keyval',
  'spark-md5',
];

const ExternalDepsGlobal: Record<string, string> = {
  'jszip': 'JSZip',
  'idb-keyval': 'idbKeyval',
  'spark-md5': 'SparkMD5',
};

const ExternalDepsFilePath: Record<string, string> = {
  'jszip': 'dist/jszip.min.js',
  'idb-keyval': 'dist/umd.js',
  'spark-md5': 'spark-md5.min.js',
};

export default defineConfig((env) => {
  const baseConfig = BaseConfig(env);
  return ({
    ...baseConfig,
    build: {
      ...baseConfig.build ?? {},
      lib: {
        entry: resolve(__dirname, '../src/main.ts'),
        name: 'YASCML',
        fileName: () => 'yascml.nolib.js',
        formats: [ 'umd' ],
      },
      rollupOptions: {
        external: ExternalDeps,
        output: {
          globals: ExternalDepsGlobal,
        },
      },
      emptyOutDir: false,
    },
    plugins: [
      {
        name: 'generate-deps',
        generateBundle() {
          const pkgDeps = packageJson.dependencies;
          const depsInfo: Record<string, DependencyInfo> = {};

          for (const dep of ExternalDeps) {
            const _version = pkgDeps[dep];
            if (!_version) continue;

            depsInfo[dep] = {
              version: valid(coerce(_version))!,
              global: ExternalDepsGlobal[dep],
              path: ExternalDepsFilePath[dep],
            };
          }

          this.emitFile({
            type: 'asset',
            fileName: 'deps.json',
            source: JSON.stringify({ dependencies: depsInfo }, null, 2)
          })
        }
      }
    ],
  });
});
