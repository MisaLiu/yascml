import { patchEngineScript } from '@yascml/patcher';
import '../../loader/dist/yascml'; // LOL

(() => {
  const _config = {
    embedModPath: [],
    custom: {
      export: [],
      init: {},
    },
    ...window.YASCMLConfig,
  };

  // Prevent SugarCube from initializing
  document.documentElement.setAttribute('data-init', 'yascml-loading');

  // Prevent the `data-init` attribute from being modified by others
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

  window.__SUGARCUBE_PATCHER = () => {
    observer.disconnect();

    const scriptDOM = document.querySelector('script#script-sugarcube');
    if (!scriptDOM)
      throw new ReferenceError('<script id="script-sugarcube"> not found!');

    const engineScriptRaw = scriptDOM.firstChild.data;
    scriptDOM.parentElement.removeChild(scriptDOM);

    const engineScriptPatched = patchEngineScript(
      engineScriptRaw,
      _config.custom.export,
      _config.custom.init
    );

    const resultDOM = document.createElement('script');
    resultDOM.id = 'script-sugarcube';
    resultDOM.innerText = engineScriptPatched;

    document.body.appendChild(resultDOM);
  };
})();
