import type { LoaderConfig } from '@yascml/loader';

export type Anify<T> = { [K in keyof T]: any };

export type CommandInput = {
  gameFile: string,
  loaderFile: string,
  embeddedMods?: string[],
  loaderConfig?: LoaderConfig,
  outputPath?: string,
  singleFile?: boolean,
};
