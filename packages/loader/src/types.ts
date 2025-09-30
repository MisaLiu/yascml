import api from './api';

export type ModAuthor = string | {
  name: string,
  url?: string,
};

// TODO
export type ModMeta = {
  id: string,
  name: string,
  author: ModAuthor | ModAuthor[],
  version: string,
  priority?: number,
  dependencies?: Record<string, string>;
  designedFor?: string,
  icon?: string,
  homepageURL?: string,
  donateURL?: string,
};

export type ModMetaFile = ModMeta & {
  preloadScripts?: string[],
  postloadScripts?: string[],
  cssFiles?: string[],
  extraFiles?: string[],
};

export type ModMetaFull = ModMeta & {
  enabled: boolean,
  embedded: boolean,
  new: boolean,
  deleted: boolean,
  updated: boolean,
  preloadScripts: File[],
  postloadScripts: File[],
  cssFiles: File[],
  extraFiles: File[],
};

export type LoaderConfig = Partial<{
  embedModPath: string[],
  custom: Partial<{
    export: string[];
    init: Partial<{ [name: string]: string }>;
  }>
}>;

export type YASCML = {
  version: string,
  mods: ModMetaFull[], // TODO
  api: typeof api,
};
