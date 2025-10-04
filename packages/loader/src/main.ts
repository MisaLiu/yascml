import { replace } from '@yascml/utils';
import { initLoader } from './init/loader';
import { patchEngineScript } from './patcher/engine';
import { executeScript } from './utils';
import { initPostloadMods, initPreloadMods } from './init/mods';

if (document.querySelector('#script-sugarcube') || window.SugarCube != null) {
  throw new Error('The SugarCube engine already initialized! Aborting...');
}

(() => {
  // Prevent initialize of SugarCube
  document.documentElement.setAttribute('data-init', 'yascml-loading');

  // Prevent document attribute been modified by others
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') continue;
      if (mutation.type === 'characterData') continue;
      if (mutation.attributeName !== 'data-init') continue;
      if (document.documentElement.getAttribute('data-init') === 'yascml-loading') continue;

      document.documentElement.setAttribute('data-init', 'yascml-loading');
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [ 'data-init' ] });

  const _patchSCScript = () => {
    const toFirstUpperCase = (string: string) => (
      `${string.charAt(0).toUpperCase()}${string.slice(1)}`
    );

    const scScriptDOM = document.querySelector('#script-sugarcube') as HTMLScriptElement;
    const scScriptRaw = scScriptDOM.innerHTML;
    document.body.removeChild(scScriptDOM);
    
    let customExport: string[] = [];
    const customInit: Record<string, string> = {};
    const { YASCMLConfig } = window;

    if (YASCMLConfig && YASCMLConfig.custom) {
      if (YASCMLConfig.custom.export) customExport = YASCMLConfig.custom.export;
      if (YASCMLConfig.custom.init) {
        for (const name in YASCMLConfig.custom.init) {
          const code = YASCMLConfig.custom.init[name];
          if (!code) continue;

          customInit[`init${toFirstUpperCase(name)}`] = code;
        }
      }
    }

    return patchEngineScript(scScriptRaw, customExport, customInit);
  };

  window.addEventListener('DOMContentLoaded', async () => {
    // Init loader and engine script
    await initLoader();
    await executeScript(_patchSCScript(), {
      domProps: {
        id: 'script-sugarcube',
      },
    });

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
        setTimeout(() => sci.LoadScreen.unlock(lockId), (sc.Engine.DOM_DELAY ?? sc.Engine.minDomActionDelay) * 2);
      })
      .catch((e) => {
        console.error(e);
        sci.LoadScreen.clear();
        return sci.Alert.fatal(null, e.message);
      });

    observer.disconnect();
  });
})();
