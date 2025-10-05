import { parse } from 'node-html-parser';
import type { WorkerInput } from './types';

const readFileAsText = (file: Blob) => new Promise<string>((res, rej) => {
  const reader = new FileReader();

  reader.onload = () => {
    res(reader.result as string);
  };

  reader.onerror = (e) => {
    rej(e);
  };

  reader.readAsText(file);
});

const readFileAsBase64 = (file: Blob) => new Promise<string>((res, rej) => {
  const reader = new FileReader();

  reader.onload = () => res(reader.result as string);
  reader.onerror = (e) => rej(e);

  reader.readAsDataURL(file);
});

const textToBuffer = (string: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(string);
};

const installLoader = async ({
  gameFile,
  loaderFile,
  singleFile,
  embedModFiles,
  ...config
}: WorkerInput) => {
  const gameText = await readFileAsText(gameFile);
  const root = parse(gameText);

  const headDOM = root.querySelector('head');
  if (!headDOM)
    throw new Error('Cannot find <head> tag in game file');

  const viewportDOM = headDOM.querySelector('meta[name="viewport"]');
  if (!viewportDOM)
    throw new Error('Cannot find <meta name="viewport"> tag in game file');

  let configDOM, loaderDOM;

  if (singleFile) {
    const modsUrl: string[] = [
      ...(await Promise.all(
        embedModFiles.map(e => readFileAsBase64(e))
      )),
      ...config.embedModPath ?? []
    ];

    configDOM = parse(`<script>window.YASCMLConfig = ${JSON.stringify({ ...config, embedModPath: modsUrl }) || '{}'};</script>`);
    loaderDOM = parse(`<script>${await readFileAsText(loaderFile)}</script>`);
  } else {
    configDOM = parse(`<script>window.YASCMLConfig = ${JSON.stringify(config) || '{}'};</script>`);
    loaderDOM = parse('<script src="yascml.js"></script>');
  }

  viewportDOM.after(configDOM, loaderDOM);

  const cspDOM = headDOM.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspDOM) {
    headDOM.removeChild(cspDOM);
  }

  return new File([textToBuffer(root.toString())], gameFile.name);
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
