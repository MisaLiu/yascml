import * as Setting from '../settings/storage';
import { executeScript, loadStyle } from '../utils';

export const initPreloadMods = async () => {
  if (Setting.get('saveMode')) return;

  const mods = window.YASCML.mods;

  for (const mod of mods) {
    if (!mod.enabled) continue;

    mod.cssFiles.forEach((file) => loadStyle(file));
    await Promise.all(
      mod.preloadScripts.map((file) => executeScript(file))
    );
  }
};

export const initPostloadMods = async () => {
  if (Setting.get('saveMode')) return;

  const mods = window.YASCML.mods;

  for (const mod of mods) {
    if (!mod.enabled) continue;
    await Promise.all(
      mod.postloadScripts.map((file) => executeScript(file))
    );
  }
};
