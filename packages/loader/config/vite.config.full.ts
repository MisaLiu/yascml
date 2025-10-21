import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import BaseConfig from './vite.config.base';

export default defineConfig((env) => ({
  ...BaseConfig(env),
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      copyDtsFiles: true,
      insertTypesEntry: true,
    }),
  ],
}));