import { parse } from 'node-html-parser';
import { patchEngineScript } from './engine';
import type { LoaderConfig } from '@yascml/loader';
/**
 * Patch the game file, injects loader config, loader itself and embedded mods.
 * 
 * @param {string} gameFileString - The game file string
 * @param {string} loaderFileString - The loader file string
 * @param {string[]} [embeddedMods = []] - Embedded mods, this is used for {@link singleFile} mode.
 * @param {LoaderConfig} [loaderConfig = {}] - Loader config.
 * @param {boolean} [singleFile = true] - Write loader and embedded mods data into HTML, 
 * this is better for single/offline distribution, but will increase the file size of
 * the game, depends on embedded mods.
 * @returns {Promise<string>} Patched game file string
 */
export const patchGameHTML = (
  gameFileString: string,
  loaderFileString: string,
  embeddedMods: string[] = [],
  loaderConfig: LoaderConfig = {},
  singleFile: boolean = true
) => new Promise<string>(async (res, rej) => {
  const _loaderConfig = {
    embedModPath: [],
    custom: {
      export: [],
      init: {},
    },
    ...loaderConfig,
  };
  let engineAlreadyPatched = false;

  const root = parse(gameFileString);

  const headDOM = root.querySelector('head');
  if (!headDOM)
    return rej('Cannot find <head> tag in game file');

  if (headDOM.querySelector('script#yascml-config')) {
    engineAlreadyPatched = true;
    headDOM.removeChild(headDOM.querySelector('script#yascml-config')!);
  }

  if (headDOM.querySelector('script#yascml')) {
    engineAlreadyPatched = true;
    headDOM.removeChild(headDOM.querySelector('script#yascml')!);
  }

  const viewportDOM = headDOM.querySelector('meta[name="viewport"]');
  if (!viewportDOM)
    return rej('Cannot find <meta name="viewport"> tag in game file');

  const engineScriptDOM = root.querySelector('script#script-sugarcube');
  if (!engineScriptDOM)
    return rej('Cannot find game engine script in game file');

  let configDOM, loaderDOM;
  if (singleFile) {
    _loaderConfig.embedModPath = [
      ...embeddedMods,
      ...loaderConfig.embedModPath ?? []
    ];

    configDOM = parse(`<script id="yascml-config">window.YASCMLConfig = ${JSON.stringify(_loaderConfig) || '{}'};</script>`);
    loaderDOM = parse(`<script id="yascml">${loaderFileString}</script>`);
  } else {
    configDOM = parse(`<script id="yascml-config">window.YASCMLConfig = ${JSON.stringify(_loaderConfig) || '{}'};</script>`);
    loaderDOM = parse('<script id="yascml" src="yascml.js"></script>');
  }

  viewportDOM.after(configDOM, loaderDOM);

  const cspDOM = headDOM.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspDOM) {
    headDOM.removeChild(cspDOM);
  }

  if (!engineAlreadyPatched) {
    const patchedScript = patchEngineScript(
      engineScriptDOM.innerHTML,
      _loaderConfig.custom.export,
      _loaderConfig.custom.init
    );

    engineScriptDOM.innerHTML = '';
    engineScriptDOM.append(patchedScript);
  }

  res(root.toString());
});
