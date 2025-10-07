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

    mod.cssFiles.forEach((file) =>
      loadStyle(file, {
        modId: mod.id,
        filename: file.name,
      })
    );

    await Promise.all(
      mod.preloadScripts.map((file) => 
        executeScript(file, {
          meta: {
            modId: mod.id,
            filename: file.name,
            timing: 'preload',
          }
        })
      )
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

  changeSplashText('Loading postload scripts...');

  const mods = window.YASCML.mods;
  for (let i = 0; i < mods.length; i++) {
    const mod = mods[i];
    changeSplashText(`Loading postload scripts... (${i + 1}/${mods.length})[${mod.id}]`);

    if (!mod.enabled || !mod.suitable) continue;
    window.__AfterInit = [];

    await Promise.all(
      mod.postloadScripts.map((file) => 
        executeScript(file, {
          meta: {
            modId: mod.id,
            filename: file.name,
            timing: 'postload',
          }
        })
      )
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
