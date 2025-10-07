import { loadStyle } from './utils';

loadStyle([
  '@keyframes _YASCML_BLINK_ {',
  'from { opacity: 1; }',
  'to { opacity: 0; }',
  '}',
].join('\n'));

export const showSplash = () => {
  const dom = document.createElement('div');
  dom.id = 'yascml-loading';
  dom.innerText = `YASCML v${__LOADER_VERSION__} Loading...`;
  dom.style = [
    'display: block',
    'position: fixed',
    'top: 0',
    'left: 0',
    'font: 1em Helmet,Freesans,sans-serif',
    'color: #eee',
    'text-align: left',
    'z-index: 500000',
    'animation-name: _YASCML_BLINK_',
    'animation-duration: 1s',
    'animation-iteration-count: infinite',
    'animation-timing-function: linear',
    'animation-direction: alternate'
  ].join(';');
  document.body.appendChild(dom);
};

export const changeSplashText = (text: string) => {
  const dom = document.querySelector<HTMLDivElement>('div#yascml-loading');
  if (!dom) return;
  dom.innerText = `[YASCML] ${text}`;
};

export const hideSplash = () => {
  if (document.querySelector('div#yascml-loading')) {
    document.body.removeChild(document.querySelector('div#yascml-loading')!);
  }
};
