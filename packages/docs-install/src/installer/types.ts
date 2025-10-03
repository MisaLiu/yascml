import type { LoaderConfig } from '@yascml/loader';

export type WorkerInput = {
  gameFile: File,
  loaderFile: Blob,
  singleFile: boolean,
  embedModFiles: Blob[],
} & LoaderConfig;
