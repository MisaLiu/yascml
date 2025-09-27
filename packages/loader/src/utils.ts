import { ModMetaFile } from "./types";

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

// TODO: Move to seperate packages?
export const patchSCScript = (script: string) => {
  const scriptMatch = script.match(/if\(document\.documentElement\.getAttribute\("data-init"\)==="loading"\){(.+)}/);
  if (!scriptMatch || !scriptMatch[1]) {
    throw new Error('Failed to patch script: Unable to find script data');
  }

  return scriptMatch[1].replace(/,jQuery\(\(function\(\){(.+)}\)\)/, SugarCubeInternalExposeScript);
};

type ExecuteScriptConfig = Partial<{
  domProps: Partial<Record<keyof HTMLScriptElement & string, string>>;
}>;

/**
 * Basically an async alternative to `eval()`, support both script string and blob.
 */
export const executeScript = (script: string | Blob, config: ExecuteScriptConfig = {}) => new Promise((res, rej) => {
  const dom = document.createElement('script');
  dom.type = 'text/javascript';
  if (config.domProps) {
    Object.assign(dom, config.domProps);
  }
  document.body.appendChild(dom);

  // Inline scripts won't trigger this event.
  dom.addEventListener('load', () => {
    res(void 0);
  });

  dom.addEventListener('error', (e) => {
    rej(e);
  });

  setTimeout(() => {
    if (typeof script === 'string') {
      dom.innerHTML = script;
      res(void 0);
    } else dom.src = URL.createObjectURL(script);
  }, 0);
});

export const isValidModMeta = (obj: Partial<ModMetaFile>) => (
  obj.id !== (void 0) && obj.name !== (void 0) && obj.author !== (void 0) && obj.version !== (void 0)
);
