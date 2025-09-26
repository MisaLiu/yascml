import { patchSCScript } from './utils';
import { initSugarCube } from './init/engine';

if (document.querySelector('#script-sugarcube') || window.SugarCube != null) {
  throw new Error('The SugarCube engine already initialized! Aborting...');
}

;(() => {
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

  const injectSCScript = () => {
    const scScriptDOM = document.querySelector('#script-sugarcube') as HTMLScriptElement;
    const scScriptRaw = scScriptDOM.innerHTML;
    document.body.removeChild(scScriptDOM);

    const newSCScriptDOM = document.createElement('script');
    newSCScriptDOM.id = 'script-sugarcube';
    newSCScriptDOM.innerHTML = patchSCScript(scScriptRaw);
    document.body.appendChild(newSCScriptDOM);
  };

  window.addEventListener('DOMContentLoaded', async () => {
    injectSCScript();

    const sc = window.SugarCube;
    const sci = window.$SugarCube!;
    if (!sc) {
      throw new Error('SugarCube not loaded properly!');
    }

    const lockId = sci.LoadScreen.lock();
		sci.LoadScreen.init();

    initSugarCube(sc, sci)
      .then(() => {
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
