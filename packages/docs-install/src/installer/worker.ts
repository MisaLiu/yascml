import { parse } from 'node-html-parser';
import type { LoaderConfig } from '@yascml/loader';

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

const textToBuffer = (string: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(string);
};

const installLoader = async (gameFile: File, config: LoaderConfig) => {
  const gameText = await readFileAsText(gameFile);
  const root = parse(gameText);

  const headDOM = root.querySelector('head');
  if (!headDOM)
    throw new Error('Cannot find <head> tag in game file');

  const versionDOM = headDOM.querySelector('meta[name="version"]');
  if (!versionDOM)
    throw new Error('Cannot find <meta name="version"> tag in game file');

  const configDOM = parse(`<script>window.YASCMLConfig = ${JSON.stringify(config) || '{}'};</script>`);
  const loaderDOM = parse('<script src="yascml.js"></script>');

  versionDOM.after(configDOM, loaderDOM);
  return new File([textToBuffer(root.toString())], gameFile.name);
};

const sendMsg = (type: string, data: any) => {
  postMessage({ type, data });
};

onmessage = ({ data: msg }) => {
  const { type, data } = msg;

  if (type === 'start') {
    const { gameFile } = data;
    installLoader(gameFile, data)
      .then((result) => sendMsg('finished', result));
  }
};
