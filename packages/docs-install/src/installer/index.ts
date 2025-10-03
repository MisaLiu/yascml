import JSZip from 'jszip';
import Worker from './worker?worker';
import { downloadFile, readFileAsBuffer } from '../utils';
import { AVAILABLE_MODS } from '../consts';
import type { GlobalState } from '../state';
import type { WorkerInput } from './types';

const UrlTestReg = /^(?:https?):\/\//i;

const parseGameFile = (input: WorkerInput) => new Promise<File>((res, rej) => {
  const worker = new Worker();

  worker.onmessage = ({ data: msg }) => {
    if (msg.type === 'finished') res(msg.data);
  };

  worker.onerror = (e) => {
    rej(e);
    worker.terminate();
  };

  worker.postMessage({
    type: 'start',
    data: input,
  });
});

export const installLoaderToFile = ({
  gameFile,
  embeddedMods,
  customExports,
  customInits,
  singleFile,
}: GlobalState) => new Promise<File>(async (res, rej) => {
  if (!gameFile)
    return rej('Please choose a file first!');

  const loaderFile = await downloadFile('resources/yascml.js', 'yascml.js');
  const downloadableMods = embeddedMods.filter(e => AVAILABLE_MODS.includes(e) || UrlTestReg.test(e));
  const unknownMods = embeddedMods.filter(e => !AVAILABLE_MODS.includes(e) && !UrlTestReg.test(e));
  const availableModFiles: File[] = [];

  for (const modPath of downloadableMods) {
    try {
      const _modPath = UrlTestReg.test(modPath) ? modPath : `resources/${modPath}`;
      const modFile = await downloadFile(_modPath);
      availableModFiles.push(modFile);
    } catch {
      unknownMods.push(modPath);
    }
  }

  const resultGameFile = await parseGameFile({
    gameFile,
    loaderFile,
    singleFile,
    embedModPath: singleFile ? unknownMods : embeddedMods,
    embedModFiles: availableModFiles,
    custom: {
      export: customExports,
      init: customInits,
    },
  });

  if (singleFile) {
    res(new File([await readFileAsBuffer(resultGameFile)], gameFile.name));
  } else {
    const resultZip = new JSZip();

    resultZip.file(resultGameFile.name, resultGameFile);
    resultZip.file(loaderFile.name, loaderFile);
    availableModFiles.forEach((file) => resultZip.file(file.name, file));

    res(new File([await resultZip.generateAsync({ type: 'blob' })], `${gameFile.name}.zip`));
  }
});
