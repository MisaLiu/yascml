import { ModMetaFile } from "./types";

export const triggerEvent = <T extends Object>(type: string, detail: T = {} as T) => (
  document.dispatchEvent(new CustomEvent(type, { detail }))
);

type ExecuteScriptConfig = Partial<{
  domProps: Partial<Record<keyof HTMLScriptElement & string, string>>;
}>;

/**
 * Basically an async alternative to `eval()`, support both script string and blob.
 */
export const executeScript = (script: string | Blob, config: ExecuteScriptConfig = {}) => new Promise((res, rej) => {
  const dom = document.createElement('script');
  dom.type = 'text/javascript';
  if (config.domProps) {
    Object.assign(dom, config.domProps);
  }
  document.body.appendChild(dom);

  // Inline scripts won't trigger this event.
  dom.addEventListener('load', () => {
    res(void 0);
  });

  dom.addEventListener('error', (e) => {
    rej(e);
  });

  setTimeout(() => {
    if (typeof script === 'string') {
      dom.innerHTML = script;
      res(void 0);
    } else dom.src = URL.createObjectURL(script);
  }, 0);
});

export const loadStyle = (style: string | Blob) => {
  if (typeof style === 'string') {
    const dom = document.createElement('style');
    dom.innerHTML = style;
    const headDOM = document.head ?? document.getElementsByTagName('head');
    headDOM.appendChild(dom);
  } else {
    const dom = document.createElement('link');
    dom.rel = 'stylesheet';
    dom.href = URL.createObjectURL(style);
    const headDOM = document.head ?? document.getElementsByTagName('head');
    headDOM.appendChild(dom);
  }
};

export const isValidModMeta = (obj: Partial<ModMetaFile>) => (
  obj.id !== (void 0) && obj.name !== (void 0) && obj.author !== (void 0) && obj.version !== (void 0)
);
