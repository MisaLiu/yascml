
export const showSplash = () => {
  const dom = document.createElement('div');
  dom.id = 'yascml-loading';
  dom.innerText = `YASCML v${__LOADER_VERSION__} Loading...`;
  dom.style = [
    'display: block',
    'position: fixed',
    'top: 0',
    'left: 0',
    'padding: 0.25em',
    "font-family: 'Courier New', 'Lucida Console', 'Monaco', 'Consolas', 'DejaVu Sans Mono', 'Liberation Mono', monospace",
    'font-size: 1em',
    'color: #eee',
    'text-align: left',
    'z-index: 500000',
    'animation-name: _YASCML_BLINK_',
    'animation-duration: 1s',
    'animation-iteration-count: infinite',
    'animation-timing-function: linear',
    'animation-direction: alternate',
    'box-sizing: border-box'
  ].join(';');
  document.body.appendChild(dom);
};

export const changeSplashText = (text: string) => {
  const dom = document.querySelector<HTMLDivElement>('div#yascml-loading');
  if (!dom) return;
  dom.innerText = `[YASCML v${__LOADER_VERSION__}] ${text}`;
};

export const hideSplash = () => {
  if (document.querySelector('div#yascml-loading')) {
    document.body.removeChild(document.querySelector('div#yascml-loading')!);
  }
};
