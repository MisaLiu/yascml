import JSZip from 'jszip';
import { isValidModMeta, getFileMD5 } from './utils';
import { ModMetaFile, ModMetaFull } from './types';

export const importModFromFile = async (modZip: Blob) => {
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
    enabled: true,
    embedded: false,
    suitable: true,
    new: false,
    updated: false,
    deleted: false,
    md5: '',
  };

  try {
    result.md5 = await getFileMD5(modZip);
  } catch (e) {
    console.warn(`Failed to get MD5 for mod: ${result.id}, using empty string`);
    console.error(e);
  }

  if (modMeta.preloadScripts !== (void 0)) {
    for (const path of modMeta.preloadScripts) {
      const file = zip.file(path);
      if (!file) {
        console.warn(`Cannot find file "${path}", skipping...`);
        continue;
      }

      const script = new File([await file.async('blob')], path);
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

      const script = new File([await file.async('blob')], path);
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

      const cssFile = new File([await file.async('blob')], path);
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

export const importModFromUrl = (url: string) => (
  fetch(url)
    .then(e => e.blob())
    .then(e => importModFromFile(e))
);

export const importMod = (file: string | Blob) => {
  if (typeof file === 'string') return importModFromUrl(file);
  return importModFromFile(file);
};
