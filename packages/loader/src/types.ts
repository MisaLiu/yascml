
// TODO
export type ModMeta = {
  id: string,
  name: string,
  author: string,
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
  preloadScripts: string[],
  postloadScripts: string[],
  cssFiles: string[],
  extraFiles: File[],
};

export type YASCML = {
  version: string,
  mods: ModMetaFull[], // TODO
};
