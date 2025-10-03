import JSZip from 'jszip';
import Worker from './worker?worker';
import { downloadFile } from '../utils';
import { AVAILABLE_MODS } from '../consts';
import type { GlobalState } from '../state';
import type { LoaderConfig } from '@yascml/loader';

type WorkerInput = {
  gameFile: File,
} & LoaderConfig;

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
}: GlobalState) => new Promise<File>(async (res, rej) => {
  if (!gameFile)
    return rej('Please choose a file first!');

  const loaderFile = await downloadFile('resources/yascml.js', 'yascml.js');
  const availableModFiles = await Promise.all(
    embeddedMods
      .filter(e => AVAILABLE_MODS.includes(e))
      .map(e => downloadFile(`resources/${e}`, e))
  );

  const resultGameFile = await parseGameFile({
    gameFile,
    embedModPath: embeddedMods,
    custom: {
      export: customExports,
      init: customInits,
    },
  });
  const resultZip = new JSZip();

  resultZip.file(resultGameFile.name, resultGameFile);
  resultZip.file(loaderFile.name, loaderFile);
  availableModFiles.forEach((file) => resultZip.file(file.name, file));

  res(new File([await resultZip.generateAsync({ type: 'blob' })], `${gameFile.name}.zip`));
});
