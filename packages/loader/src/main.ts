import { replace } from '@yascml/utils';
import { initLoader } from './init/loader';
import { initPostloadMods, initPreloadMods } from './init/mods';

if (document.querySelector('#script-sugarcube') || window.SugarCube != null) {
  throw new Error('The SugarCube engine already initialized! Aborting...');
}

if (window.YASCML != null) {
  throw new Error('Another YASCML is running! Aborting...');
}

const showLoadingScreen = () => {
  const dom = document.createElement('div');
  dom.id = 'yascml-loading';
  dom.innerText = 'YASCML loading...';
  dom.style = [
    'display: block',
    'position: fixed',
    'top: 31%',
    'left: 50%',
    'transform: translate(-50%, -50%)',
    'font: 28px/1 Helmet,Freesans,sans-serif',
    'font-weight: 700',
    'color: #eee',
    'text-align: center',
    'z-index: 500000'
  ].join(';');
  document.body.appendChild(dom);
};

const hideLoadingScreen = () => {
  if (document.querySelector('div#yascml-loading')) {
    document.body.removeChild(document.querySelector('div#yascml-loading')!);
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  if (window.__SUGARCUBE_PATCHER) {
    await Promise.resolve(window.__SUGARCUBE_PATCHER);
  }

  if (!window.$SugarCube) {
    throw new Error('You are running YASCML on a original SugarCube engine! Please patch the engine first.');
  }

  // Init loader
  showLoadingScreen();
  await initLoader();

  const sc = window.SugarCube;
  const sci = window.$SugarCube!;
  if (!sc) {
    throw new Error('SugarCube not loaded properly!');
  }

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

  const lockId = sci.LoadScreen.lock();
  sci.LoadScreen.init();

  if (document.normalize) document.normalize();

  initPreloadMods()
    .then(() => Promise.resolve(sci.$init.initEngine()))
    .then(() => initPostloadMods())
    .then(() => {
      delete window.__AfterInit;
      window.YASCML.stats.isEngineInit = true;
      hideLoadingScreen();
      setTimeout(() => sci.LoadScreen.unlock(lockId), (sc.Engine.DOM_DELAY ?? sc.Engine.minDomActionDelay) * 2);
    })
    .catch((e) => {
      console.error(e);
      hideLoadingScreen();
      sci.LoadScreen.clear();
      return sci.Alert.fatal(null, e.message);
    });
});
