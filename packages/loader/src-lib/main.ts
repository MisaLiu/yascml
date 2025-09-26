import { SugarCube, SugarCubeInternal } from '@yascml/types';

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

  const initSugarCube = (sc: SugarCube, sce: SugarCubeInternal, loadScreenLockId: number) => {
    if (document.normalize) {
      document.normalize();
    }

    if (sc.Story.load) sc.Story.load();
    else sc.Story.init();

    sce.$init.initStorage();

    sc.Dialog.init();
    sc.UIBar.init();
    sc.Engine.init();
    if (sce.Outlines) sce.Outlines.init();
    if (sc.Engine.runUserScripts) sc.Engine.runUserScripts();
    sc.L10n.init();

    if (!sc.session!.has('rcWarn') && sc.storage!.name === 'cookie') {
      sc.session!.set('rcWarn', 1);
      window.alert(sc.L10n.get('warningNoWebStorage'));
    }

    sc.Save.init();
    sc.Setting.init();
    if (sce.Links) sce.Links.init();
    sc.Macro.init();
    sc.Engine.start();

    const $window = $(window);
		const vprCheckId = setInterval(() => {
			if (!$window.width()) {
				return;
			}

			clearInterval(vprCheckId);
			sc.UIBar.start();

			sce.LoadScreen.unlock(loadScreenLockId);

			jQuery.event.trigger({ type : ':storyready' });
		}, sc.Engine.minDomActionDelay);
  };

  window.addEventListener('DOMContentLoaded', async () => {
    injectSCScript();

    const sc = window.SugarCube;
    if (!sc) {
      throw new Error('SugarCube not loaded properly!');
    }

    const lockId = window.$SugarCube!.LoadScreen.lock();
		window.$SugarCube!.LoadScreen.init();

    initSugarCube(window.SugarCube!, window.$SugarCube!, lockId);

    observer.disconnect();
  });
})();

