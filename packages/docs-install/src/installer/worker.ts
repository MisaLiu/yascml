import { patchGameHTML } from '@yascml/patcher';
import type { WorkerInput } from './types';

const installLoader = async ({
  gameFile,
  loaderFile,
  singleFile,
  embedModFiles,
  ...config
}: WorkerInput) => {
  return patchGameHTML(gameFile, loaderFile, embedModFiles, config, singleFile);
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