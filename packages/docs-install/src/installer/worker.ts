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

  const viewportDOM = headDOM.querySelector('meta[name="viewport"]');
  if (!viewportDOM)
    throw new Error('Cannot find <meta name="viewport"> tag in game file');

  const configDOM = parse(`<script>window.YASCMLConfig = ${JSON.stringify(config) || '{}'};</script>`);
  const loaderDOM = parse('<script src="yascml.js"></script>');

  viewportDOM.after(configDOM, loaderDOM);

  if (!headDOM.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspDOM = parse(`<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:">`);
    viewportDOM.before(cspDOM);
  }

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
