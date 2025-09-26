import { LoadScreenAPI } from 'twine-sugarcube';

export type $LoadScreenAPI = LoadScreenAPI & {
  init: () => void,
  clear: () => void,
  hide: () => void,
  show: () => void,
  size?: number,
};

export interface SimpleStorageAdapter {
  new (storageId: string, persistant: boolean): this;

  name: string;
  id: string;

  size(): number;
  keys(): string[];
  has(key: string): boolean;
  get<T extends any>(key: string): T | null;
  set<T extends any>(key: string, value: T): boolean;
  delete(key: string): boolean;
  clear(): boolean;

  length: number;
};

export type SimpleStoreAPI = {
  adapters: SimpleStorageAdapter[],
  create: (storageId: string, persistant: boolean) => SimpleStorageAdapter;
};

export type OutlinesAPI = {
  init(): void;
  show(): void;
  hide(): void;
};

export type LinksAPI = {
  init(): void;
};

export type AlertAPI = {
  error(where: string | null, message: string | Error): void;
  fatal(where: string | null, message: string | Error): void;
};

export type SugarCubeInternal = {
  LoadScreen: $LoadScreenAPI;
  SimpleStore: SimpleStoreAPI;
  Outlines: OutlinesAPI | null;
  Links: LinksAPI | null;
  Alert: AlertAPI;
  $init: {
    initStorage(): void;
  }
};
