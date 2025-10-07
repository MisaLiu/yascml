import * as Setting from '../settings/storage';
import { changeSplashText } from '../splash';
import { executeScript, loadStyle } from '../utils';

export const initPreloadMods = async () => {
  if (Setting.get('saveMode')) return;

  changeSplashText('Loading preload scripts...');

  const mods = window.YASCML.mods;
  for (let i = 0; i < mods.length; i++) {
    const mod = mods[i];
    changeSplashText(`Loading preload scripts... (${i + 1}/${mods.length})[${mod.id}]`);

    if (!mod.enabled || !mod.suitable) continue;
    window.__AfterInit = [];

    if (mod.cssFiles) {
      for (const path of mod.cssFiles) {
        const blob = mod.zip!.file(path);
        if (!blob) {
          console.warn(`Cannot find file "${path}", skipping...`);
          continue;
        }

        loadStyle(await blob.async('blob'), {
          modId: mod.id,
          filename: path,
        });
      }
    }

    if (mod.preloadScripts) {
      for (const path of mod.preloadScripts) {
        const blob = mod.zip!.file(path);
        if (!blob) {
          console.warn(`Cannot find file "${path}", skipping...`);
          return;
        }

        await executeScript(await blob.async('blob'), {
          meta: {
            modId: mod.id,
            filename: path,
            timing: 'preload',
          }
        });
      }

      if (window.__AfterInit.length > 0) {
        for (const fn of window.__AfterInit) {
          await Promise.resolve(fn());
        }
      }
    }
  }
};

export const initPostloadMods = async () => {
  if (Setting.get('saveMode')) return;

  changeSplashText('Loading postload scripts...');

  const mods = window.YASCML.mods;
  for (let i = 0; i < mods.length; i++) {
    const mod = mods[i];
    changeSplashText(`Loading postload scripts... (${i + 1}/${mods.length})[${mod.id}]`);

    if (!mod.enabled || !mod.suitable) continue;
    window.__AfterInit = [];

    if (mod.postloadScripts) {
      for (const path of mod.postloadScripts) {
        const blob = mod.zip!.file(path);
        if (!blob) {
          console.warn(`Cannot find file "${path}", skipping...`);
          return;
        }

        await executeScript(await blob.async('blob'), {
          meta: {
            modId: mod.id,
            filename: path,
            timing: 'preload',
          }
        });
      }

      if (window.__AfterInit.length > 0) {
        for (const fn of window.__AfterInit) {
          await Promise.resolve(fn());
        }
      }
    }
  }
};
