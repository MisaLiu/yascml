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
      await Promise.all(
        mod.cssFiles.map((path) => {
          const blob = mod.zip!.file(path);
          if (!blob) {
            console.warn(`Cannot find file "${path}", skipping...`);
            return;
          }

          return (
            blob
              .async('blob')
              .then((e) => loadStyle(e, {
                modId: mod.id,
                filename: path,
              }))
          );
        })
      );
    }

    if (mod.preloadScripts) {
      await Promise.all(
        mod.preloadScripts.map((path) => {
          const blob = mod.zip!.file(path);
          if (!blob) {
            console.warn(`Cannot find file "${path}", skipping...`);
            return;
          }

          return (
            blob
              .async('blob')
              .then((e) => executeScript(e, {
                meta: {
                  modId: mod.id,
                  filename: path,
                  timing: 'preload',
                }
              }))
          );
        })
      );

      if (window.__AfterInit.length > 0) {
        await Promise.all(
          window.__AfterInit.map(e => {
            if (typeof e === 'function') return Promise.resolve(e());
            else Promise.resolve(e);
          })
        );
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
      await Promise.all(
        mod.postloadScripts.map((path) => {
          const blob = mod.zip!.file(path);
          if (!blob) {
            console.warn(`Cannot find file "${path}", skipping...`);
            return;
          }

          return (
            blob
              .async('blob')
              .then((e) => executeScript(e, {
                meta: {
                  modId: mod.id,
                  filename: path,
                  timing: 'postload',
                }
              }))
          );
        })
      );

      if (window.__AfterInit.length > 0) {
        await Promise.all(
          window.__AfterInit.map(e => {
            if (typeof e === 'function') return Promise.resolve(e());
            else Promise.resolve(e);
          })
        );
      }
    }
  }
};
