import { importMod } from '../importer';
import { triggerEvent } from '../utils';

/**
 * Add a mod, could be a `Blob` or file url.
 * @param file 
 */
const add = async (file: string | Blob) => {
  const mod = await importMod(file);
  window.YASCML.mods.push(mod);
  triggerEvent('$modadded', { mod: mod });
};

/**
 * Remove a loaded mod.
 * @param modId 
 */
const remove = (modId: string) => {
  const index = window.YASCML.mods.findIndex(e => e.id === modId);
  if (index === -1)
    throw new Error(`Cannot find mod ID: ${modId}`);

  const removedMod = window.YASCML.mods.splice(index, 1)[0];
  triggerEvent('$modremoved', { mod: removedMod });
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
