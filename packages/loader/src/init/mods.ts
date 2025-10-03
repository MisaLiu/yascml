import * as Setting from '../settings/storage';
import { executeScript, loadStyle } from '../utils';

export const initPreloadMods = async () => {
  if (Setting.get('saveMode')) return;

  const mods = window.YASCML.mods;

  for (const mod of mods) {
    if (!mod.enabled || !mod.suitable) continue;
    window.__AfterInit = [];

    mod.cssFiles.forEach((file) => loadStyle(file));
    await Promise.all(
      mod.preloadScripts.map((file) => executeScript(file))
    );

    if (window.__AfterInit.length > 0) {
      await Promise.all(
        window.__AfterInit.map(e => 
          Promise.resolve(e)
        )
      );
    }
  }
};

export const initPostloadMods = async () => {
  if (Setting.get('saveMode')) return;

  const mods = window.YASCML.mods;

  for (const mod of mods) {
    if (!mod.enabled || !mod.suitable) continue;
    window.__AfterInit = [];

    await Promise.all(
      mod.postloadScripts.map((file) => executeScript(file))
    );

    if (window.__AfterInit.length > 0) {
      await Promise.all(
        window.__AfterInit.map(e => 
          Promise.resolve(e)
        )
      );
    }
  }
};
