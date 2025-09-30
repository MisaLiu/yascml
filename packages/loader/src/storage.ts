import * as IDB from 'idb-keyval';

const store = IDB.createStore('yascml-mods', 'yascml-mods');

export const get = (key: string) => IDB.get(key, store);

export const getAll = () => IDB.values(store);

export const getKets = () => IDB.keys(store) as Promise<string[]>;

export const set = async (key: string, value: any) => {
  if (await get(key)) return IDB.update(key, value, store);
  return IDB.set(key, value, store);
};

export const del = (key: string) => IDB.del(key, store);
