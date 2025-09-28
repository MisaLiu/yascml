import { executeScript } from '../utils';

export const initPreloadMods = async () => {
  const mods = window.YASCML.mods;

  for (const mod of mods) {
    if (!mod.enabled) return;
    await Promise.all(
      mod.preloadScripts.map((file) => executeScript(file))
    );
  }
};

export const initPostloadMods = async () => {
  const mods = window.YASCML.mods;

  for (const mod of mods) {
    if (!mod.enabled) return;
    await Promise.all(
      mod.postloadScripts.map((file) => executeScript(file))
    );
  }
};
