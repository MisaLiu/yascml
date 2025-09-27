import { importMod } from '../importer';

/**
 * Add a mod, could be a `Blob` or file url.
 * @param file 
 */
const add = async (file: string | Blob) => {
  const mod = await importMod(file);
  window.YASCML.mods.push(mod);
};

/**
 * Remove a loaded mod.
 * @param modId 
 */
const remove = (modId: string) => {
  const index = window.YASCML.mods.findIndex(e => e.id === modId);
  if (index === -1)
    throw new Error(`Cannot find mod ID: ${modId}`);

  window.YASCML.mods.splice(index, 1);
};

const enable = (modId: string) => {
  const index = window.YASCML.mods.findIndex(e => e.id === modId);
  if (index === -1)
    throw new Error(`Cannot find mod ID: ${modId}`);

  window.YASCML.mods[index].enabled = true;
};

const disable = (modId: string) => {
  const index = window.YASCML.mods.findIndex(e => e.id === modId);
  if (index === -1)
    throw new Error(`Cannot find mod ID: ${modId}`);

  window.YASCML.mods[index].enabled = false;
};

export default {
  add,
  remove,
  enable,
  disable,
};
