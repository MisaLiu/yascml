import { YASCML } from '../types';
import api from '../api';
import { importModFromUrl } from '../importer';

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
          window.YASCML.mods.push(await importModFromUrl(path));
        } catch (e) {
          console.warn(`Error when loading embed mod: ${path}, skipping...`);
          console.error(e);
        }
      }
    }
  }
};
