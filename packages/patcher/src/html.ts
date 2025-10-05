import { parse } from 'node-html-parser';
import { patchEngineScript } from './engine';
import {
  readFileAsText,
  readFileAsBase64,
  textToBuffer
} from './reader';
import type { LoaderConfig } from '@yascml/loader';
/**
 * Patch the game file, injects loader config, loader itself and embedded mods.
 * 
 * @param {File} gameFile - The game file
 * @param {Blob} loaderFile - The loader file
 * @param {Blob[]} [embeddedMods = []] - Embedded mods, this is used for {@link singleFile} mode.
 * @param {LoaderConfig} [loaderConfig = {}] - Loader config.
 * @param {boolean} [singleFile = true] - Write loader and embedded mods data into HTML, 
 * this is better for single/offline distribution, but will increase the file size of
 * the game, depends on embedded mods.
 * @returns {Promise<File>} Patched game file
 */
export const patchGameHTML = (
  gameFile: File,
  loaderFile: Blob,
  embeddedMods: Blob[] = [],
  loaderConfig: LoaderConfig = {},
  singleFile: boolean = true
) => new Promise<File>(async (res, rej) => {
  const _loaderConfig = {
    embedModPath: [],
    custom: {
      export: [],
      init: {},
    },
    ...loaderConfig,
  };

  const gameText = await readFileAsText(gameFile);
  const root = parse(gameText);

  const headDOM = root.querySelector('head');
  if (!headDOM)
    return rej('Cannot find <head> tag in game file');

  if (headDOM.querySelector('script#yascml-config')) {
    headDOM.removeChild(headDOM.querySelector('script#yascml-config')!);
  }

  if (headDOM.querySelector('script#yascml')) {
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
      ...(await Promise.all(
        embeddedMods.map(e => readFileAsBase64(e))
      )),
      ...loaderConfig.embedModPath ?? []
    ];

    configDOM = parse(`<script id="yascml-config">window.YASCMLConfig = ${JSON.stringify(_loaderConfig) || '{}'};</script>`);
    loaderDOM = parse(`<script id="yascml">${await readFileAsText(loaderFile)}</script>`);
  } else {
    configDOM = parse(`<script id="yascml-config">window.YASCMLConfig = ${JSON.stringify(_loaderConfig) || '{}'};</script>`);
    loaderDOM = parse('<script id="yascml" src="yascml.js"></script>');
  }

  viewportDOM.after(configDOM, loaderDOM);

  const cspDOM = headDOM.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspDOM) {
    headDOM.removeChild(cspDOM);
  }

  const patchedScript = patchEngineScript(
    engineScriptDOM.innerHTML,
    _loaderConfig.custom.export,
    _loaderConfig.custom.init
  );

  engineScriptDOM.innerHTML = '';
  engineScriptDOM.append(patchedScript);

  res(new File([textToBuffer(root.toString())], gameFile.name));
});
