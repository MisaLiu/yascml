import * as IDB from '../storage';
import * as Setting from '../settings/storage';
import { YASCML } from '../types';
import api from '../api';
import { importMod } from '../importer';
import { unescapeHTML, sortMods, isModSuitable } from '../utils';

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
      stats: {
        gameName: unescapeHTML(document.querySelector<HTMLElement>('tw-storydata')!.getAttribute('name')!),
        isLoaderInit: false,
        isEngineInit: false,
      },
    } as YASCML)),
  });

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

  if (window.YASCMLConfig) {
    if (window.YASCMLConfig.embedModPath) {
      for (const path of window.YASCMLConfig.embedModPath) {
        try {
          const mod = await importMod(path);
          if (window.YASCML.mods.findIndex(e => e.id === mod.id) !== -1) continue;

          mod.embedded = true;
          window.YASCML.mods.push(mod);
        } catch (e) {
          console.warn(`Error when loading embed mod: ${path}, skipping...`);
          console.error(e);
        }
      }
    }
  }

  window.YASCML.mods.sort(sortMods);

  for (const modId of Setting.get('disabledMods')) {
    const index = window.YASCML.mods.findIndex(e => e.id === modId);
    if (index === -1) continue;

    window.YASCML.mods[index].enabled = false;
  }

  for (const mod of window.YASCML.mods) {
    mod.suitable = isModSuitable(mod);
  }

  window.YASCML.stats.isLoaderInit = true;
};
