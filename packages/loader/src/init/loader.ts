import * as idbKeyval from 'idb-keyval';
import JSZip from 'jszip';
import * as IDB from '../storage';
import * as Setting from '../settings/storage';
import { changeSplashText } from '../splash';
import api from '../api';
import { importMod } from '../importer';
import { unescapeHTML, sortMods, isModSuitable } from '../utils';
import { YASCML } from '../types';

/**
 * Initialize the loader.
 */
export const initLoader = async () => {
  changeSplashText('Preparing loader...');

  if (!window.JSZip) window.JSZip = JSZip;
  if (!window.idbKeyval) window.idbKeyval = idbKeyval;

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

  {
    changeSplashText('Loading imported mods...');

    const modIDs = await IDB.getKets();
    for (let i = 0; i < modIDs.length; i ++) {
      const modId = modIDs[i];
      changeSplashText(`Loading imported mods... (${i + 1}/${modIDs.length})[${modId}]`);

      try {
        const modFile = await IDB.get(modId);
        const mod = await importMod(modFile);
        window.YASCML.mods.push(mod);
      } catch (e) {
        console.warn(`Error when loading mod: ${modId}, skipping...`);
        console.error(e);
      }
    }
  }

  if (window.YASCMLConfig) {
    if (window.YASCMLConfig.embedModPath) {
      changeSplashText('Loading embedded mods...');

      const modPaths = window.YASCMLConfig.embedModPath;
      for (let i = 0; i < modPaths.length; i++) {
        const path = modPaths[i];
        changeSplashText(`Loading embedded mods... (${i + 1}/${modPaths.length})${path.length <= 200 ? `[${path}]` : ''}`);

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
