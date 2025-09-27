import JSZip from 'jszip';
import { isValidModMeta } from '../utils';
import { ModMetaFile, ModMetaFull } from '../types';

export const importMod = async (modZip: Blob) => {
  const zip = await JSZip.loadAsync(modZip);
  if (!zip.file('meta.json'))
    throw new Error('"meta.json" not found in mod file, is this a valid mod file?');

  const modMetaString = await (zip.file('meta.json')!).async('text');
  const modMeta = JSON.parse(modMetaString) as ModMetaFile;
  if (!isValidModMeta(modMeta))
    throw new Error('Invalid format of "meta.json"');

  const result: ModMetaFull = {
    ...modMeta,
    preloadScripts: [],
    postloadScripts: [],
    cssFiles: [],
    extraFiles: [],
  };

  if (modMeta.preloadScripts !== (void 0)) {
    for (const path of modMeta.preloadScripts) {
      const file = zip.file(path);
      if (!file) {
        console.warn(`Cannot find file "${path}", skipping...`);
        continue;
      }

      const script = await file.async('string');
      result.preloadScripts.push(script);
    }
  }

  if (modMeta.postloadScripts !== (void 0)) {
    for (const path of modMeta.postloadScripts) {
      const file = zip.file(path);
      if (!file) {
        console.warn(`Cannot find file "${path}", skipping...`);
        continue;
      }

      const script = await file.async('string');
      result.postloadScripts.push(script);
    }
  }

  if (modMeta.cssFiles !== (void 0)) {
    for (const path of modMeta.cssFiles) {
      const file = zip.file(path);
      if (!file) {
        console.warn(`Cannot find file "${path}", skipping...`);
        continue;
      }

      const cssFile = await file.async('string');
      result.cssFiles.push(cssFile);
    }
  }

  if (modMeta.extraFiles !== (void 0)) {
    for (const path of modMeta.extraFiles) {
      const file = zip.file(path);
      if (!file) {
        console.warn(`Cannot find file "${path}", skipping...`);
        continue;
      }

      const extraFile = new File([await file.async('blob')], path);
      result.extraFiles.push(extraFile);
    }
  }

  return result;
};
