
const buildSugarCubeStorageInit = (custom?: string) => ( /*javascript*/`
function initStorage() {
  ${custom ? custom : 
    /*javascript*/`
    storage = SimpleStore.create(Story.id ?? Story.domId, true);
    session = SimpleStore.create(Story.id ?? Story.domId, false);
  `}

  window.SugarCube.storage = storage;
  window.SugarCube.session = session;
};`);

const buildCustomInitFunction = (name: string, code: string) => (
`function ${name}() {
${code}
};`);

const buildSugarCubeExposeScript = (customExpose?: string[], customInit?: string[]) => ( /*javascript*/`
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
      initStorage,
      ${customInit ? customInit.filter(e => e !== 'initStorage').join(',')  : ''}
    },
    ${customExpose ? customExpose.join(',')  : ''}
  }),
})`);

/**
 * Patch the original SugarCube script, expose some internal variables and remove initial function.
 * 
 * @param script 
 * @param customExpose 
 * @param customInit 
 * @returns 
 */
export const patchEngineScript = (
  script: string,
  customExpose?: string[],
  customInit?: { [name: string]: string }
) => {
  const scriptMatch = script.match(/if\(document\.documentElement\.getAttribute\("data-init"\)==="loading"\){(.+)}/);
  if (!scriptMatch || !scriptMatch[1]) {
    throw new Error('Failed to patch script: Unable to find script data');
  }

  const customStorageInit = customInit ? customInit['initStorage'] : (void 0);
  let replaceInitScript = `;${buildSugarCubeStorageInit(customStorageInit)}`;
  if (customInit) {
    for (const name in customInit) {
      if (name === 'initStorage') continue;
      replaceInitScript += buildCustomInitFunction(name, customInit[name]);
    }
  }
  replaceInitScript += buildSugarCubeExposeScript(customExpose, Object.keys(customInit ?? {}));

  return scriptMatch[1].replace(/,jQuery\(\(function\(\){(.+)}\)\)/, replaceInitScript);
};
