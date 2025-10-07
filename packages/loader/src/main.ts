import { replace } from '@yascml/utils';
import { showSplash, changeSplashText, hideSplash } from './splash';
import { initLoader } from './init/loader';
import { initPostloadMods, initPreloadMods } from './init/mods';

if (document.querySelector('#script-sugarcube') || window.SugarCube != null) {
  throw new Error('The SugarCube engine already initialized! Aborting...');
}

if (window.YASCML != null) {
  throw new Error('Another YASCML is running! Aborting...');
}

if (window.Reflect == null) {
  throw new Error('Your browser is too old! Upgrade your browser to use YASCML');
}

window.addEventListener('DOMContentLoaded', async () => {
  if (window.__SUGARCUBE_PATCHER) {
    await Promise.resolve(window.__SUGARCUBE_PATCHER());
  }

  if (!window.$SugarCube) {
    throw new Error('You are running YASCML on a original SugarCube engine! Please patch the engine first.');
  }

  const sc = window.SugarCube;
  const sci = window.$SugarCube!;
  if (!sc) {
    throw new Error('SugarCube not loaded properly!');
  }

  showSplash();
  const lockId = sci.LoadScreen.lock();
  sci.LoadScreen.init();

  // Init loader
  await initLoader();

  // Add mod menu list to sidebar
  replace(sc.UIBar, 'init', {
    value() {
      this.$init();

      const navDOM = document.querySelector('#menu') as HTMLDivElement;
      const menuListDOM = document.createElement('ul');

      menuListDOM.id = 'menu-yascml';
      navDOM.appendChild(menuListDOM);
    },
  });

  if (document.normalize) document.normalize();

  initPreloadMods()
    .then(() => {
      changeSplashText('Loading game engine...');
      return Promise.resolve(sci.$init.initEngine());
    })
    .then(() => initPostloadMods())
    .then(() => {
      delete window.__AfterInit;
      window.YASCML.stats.isEngineInit = true;
      changeSplashText('Starting game...');

      setTimeout(() => {
        hideSplash();
        sci.LoadScreen.unlock(lockId);
      }, (sc.Engine.DOM_DELAY ?? sc.Engine.minDomActionDelay) * 2);
    })
    .catch((e) => {
      console.error(e);
      hideSplash();
      sci.LoadScreen.clear();
      return sci.Alert.fatal(null, e.message);
    });
});
