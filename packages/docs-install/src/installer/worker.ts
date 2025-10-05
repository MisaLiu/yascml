import { patchGameHTML } from '@yascml/patcher';
import { readFileAsText, readFileAsBase64, textToBuffer } from './reader';
import type { WorkerInput } from './types';

const installLoader = async ({
  gameFile,
  loaderFile,
  singleFile,
  embedModFiles,
  ...config
}: WorkerInput) => {
  const gameFileStr = await readFileAsText(gameFile);
  const loaderFileStr = await readFileAsText(loaderFile);
  const embeddedModsStr: string[] = [];

  if (embedModFiles) {
    for (const mod of embedModFiles) {
      embeddedModsStr.push(await readFileAsBase64(mod));
    }
  }

  const patchResult = await patchGameHTML(gameFileStr, loaderFileStr, embeddedModsStr, config, singleFile);
  return new File([textToBuffer(patchResult)], gameFile.name);
};

const sendMsg = (type: string, data: any) => {
  postMessage({ type, data });
};

onmessage = ({ data: msg }) => {
  const { type, data } = msg as { type: string, data: unknown };

  if (type === 'start') {
    installLoader(data as WorkerInput)
      .then((result) => sendMsg('finished', result));
  }
};