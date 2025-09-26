import { LoadScreenAPI } from 'twine-sugarcube';

export type $LoadScreenAPI = LoadScreenAPI & {
  init: () => void,
  clear: () => void,
  hide: () => void,
  show: () => void,
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

export type SugarCubeInternal = {
  LoadScreen: $LoadScreenAPI;
  SimpleStore: SimpleStoreAPI;
  $init: {
    initStorage(): void;
  }
};
