import { replace } from '@yascml/utils';
import { initLoader } from './init/loader';
import { initPostloadMods, initPreloadMods } from './init/mods';
import { loadStyle } from './utils';

if (document.querySelector('#script-sugarcube') || window.SugarCube != null) {
  throw new Error('The SugarCube engine already initialized! Aborting...');
}

if (window.YASCML != null) {
  throw new Error('Another YASCML is running! Aborting...');
}

if (window.Reflect == null) {
  throw new Error('Your browser is too old! Upgrade your browser to use YASCML');
}

loadStyle([
  '@keyframes _YASCML_BLINK_ {',
  'from { opacity: 1; }',
  'to { opacity: 0; }',
  '}',
].join('\n'));

const showLoadingScreen = () => {
  const dom = document.createElement('div');
  dom.id = 'yascml-loading';
  dom.innerText = `YASCML v${__LOADER_VERSION__} Loading...`;
  dom.style = [
    'display: block',
    'position: fixed',
    'top: 0',
    'left: 0',
    'font: 1em Helmet,Freesans,sans-serif',
    'color: #eee',
    'text-align: left',
    'z-index: 500000',
    'animation-name: _YASCML_BLINK_',
    'animation-duration: 1s',
    'animation-iteration-count: infinite',
    'animation-timing-function: linear',
    'animation-direction: alternate'
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

  showLoadingScreen();
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
    .then(() => Promise.resolve(sci.$init.initEngine()))
    .then(() => initPostloadMods())
    .then(() => {
      delete window.__AfterInit;
      window.YASCML.stats.isEngineInit = true;

      setTimeout(() => {
        hideLoadingScreen();
        sci.LoadScreen.unlock(lockId);
      }, (sc.Engine.DOM_DELAY ?? sc.Engine.minDomActionDelay) * 2);
    })
    .catch((e) => {
      console.error(e);
      hideLoadingScreen();
      sci.LoadScreen.clear();
      return sci.Alert.fatal(null, e.message);
    });
});
