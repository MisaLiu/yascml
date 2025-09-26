import { initSugarCube } from './initEngine';

if (document.querySelector('#script-sugarcube') || window.SugarCube != null) {
  throw new Error('The SugarCube engine already initialized! Aborting...');
}

;(() => {
  const SugarCubeInternalExposeScript = `;
function initStorage() {
  storage = SimpleStore.create(Story.id ?? Story.domId, true);
  session = SimpleStore.create(Story.id ?? Story.domId, false);

  window.SugarCube.storage = storage;
  window.SugarCube.session = session;
};
let _Outlines = null, _Links = null;
try { _Outlines = Outlines } catch {}
try { _Outlines = Outliner } catch {}
try { _Links = Links } catch {}
Object.defineProperty(window, '$SugarCube', {
  value: Object.freeze({
    LoadScreen,
    SimpleStore,
    Outlines: _Outlines,
    Links: _Links,
    Alert,
    $init: {
      initStorage
    }
  }),
})`;

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

  // TODO: Should move to utils
  const patchSCScript = (script: string) => {
    const scriptMatch = script.match(/if\(document\.documentElement\.getAttribute\("data-init"\)==="loading"\){(.+)}/);
    if (!scriptMatch || !scriptMatch[1]) {
      throw new Error('Failed to patch script: Unable to find script data');
    }

    return scriptMatch[1].replace(/,jQuery\(\(function\(\){(.+)}\)\)/, SugarCubeInternalExposeScript);
  };

  const injectSCScript = () => {
    const scScriptDOM = document.querySelector('#script-sugarcube') as HTMLScriptElement;
    const scScriptRaw = scScriptDOM.innerHTML;
    document.body.removeChild(scScriptDOM);

    const blankSCScriptDOM = document.createElement('script');
    blankSCScriptDOM.id = 'script-sugarcube';
    document.body.appendChild(blankSCScriptDOM);

    eval(patchSCScript(scScriptRaw));
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

