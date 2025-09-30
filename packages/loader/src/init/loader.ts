import * as IDB from '../storage';
import * as Setting from '../settings/storage';
import { YASCML } from '../types';
import api from '../api';
import { importMod } from '../importer';

/**
 * Initialize the loader.
 */
export const initLoader = async () => {
  Object.defineProperty(window, 'YASCML', {
    configurable: false,

    value: Object.seal(Object.assign(Object.create(null), {
      version: __LOADER_VERSION__,
      mods: [],
      api,
    } as YASCML)),
  });

  if (window.YASCMLConfig) {
    if (window.YASCMLConfig.embedModPath) {
      for (const path of window.YASCMLConfig.embedModPath) {
        try {
          const mod = await importMod(path);
          mod.embedded = true;
          window.YASCML.mods.push(mod);
        } catch (e) {
          console.warn(`Error when loading embed mod: ${path}, skipping...`);
          console.error(e);
        }
      }
    }
  }

  for (const modId of await IDB.getKets()) {
    try {
      const modFile = await IDB.get(modId);
      const mod = await importMod(modFile);
      window.YASCML.mods.push(mod);
    } catch (e) {
      console.warn(`Error when loading mod: ${modId}, skipping...`);
      console.error(e);
    }
  }

  for (const modId of Setting.get('disabledMods')) {
    const index = window.YASCML.mods.findIndex(e => e.id === modId);
    if (index === -1) continue;

    window.YASCML.mods[index].enabled = false;
  }
};
