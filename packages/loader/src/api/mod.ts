import * as S from '../storage';
import { importMod } from '../importer';
import { triggerEvent } from '../utils';

/**
 * Add a mod, could be a `Blob` or file url.
 * @param file 
 */
const add = async (file: string | Blob) => {
  const mod = await importMod(file);
  S.set(mod.id, file);

  const oldModIndex = window.YASCML.mods.findIndex(e => e.id === mod.id);
  if (oldModIndex === -1) {
    mod.new = true;
    window.YASCML.mods.push(mod);
  } else {
    mod.updated = true;
    window.YASCML.mods.splice(oldModIndex, 1, mod);
  }

  triggerEvent('$modadded', { mod });
};

/**
 * Remove a loaded mod.
 * @param modId 
 */
const remove = async (modId: string) => {
  const index = window.YASCML.mods.findIndex(e => e.id === modId);
  if (index === -1)
    throw new Error(`Cannot find mod ID: ${modId}`);

  await S.del(modId);
  const mod = window.YASCML.mods[index];
  mod.deleted = true;
  triggerEvent('$modremoved', { mod });
};

const enable = (modId: string) => {
  const index = window.YASCML.mods.findIndex(e => e.id === modId);
  if (index === -1)
    throw new Error(`Cannot find mod ID: ${modId}`);

  window.YASCML.mods[index].enabled = true;
  triggerEvent('$modenabled', { mod: window.YASCML.mods[index] });
};

const disable = (modId: string) => {
  const index = window.YASCML.mods.findIndex(e => e.id === modId);
  if (index === -1)
    throw new Error(`Cannot find mod ID: ${modId}`);

  window.YASCML.mods[index].enabled = false;
  triggerEvent('$moddisabled', { mod: window.YASCML.mods[index] });
};

const get = (modId: string) => {
  const index = window.YASCML.mods.findIndex(e => e.id === modId);
  if (index === -1)
    throw new Error(`Cannot find mod ID: ${modId}`);

  return window.YASCML.mods[index];
};

export default {
  add,
  remove,
  enable,
  disable,
  get,
};
