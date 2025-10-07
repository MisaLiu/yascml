import semver from 'semver';
import SparkMD5 from 'spark-md5';
import { ModMetaFile, ModMetaFull, ModFileMeta } from './types';

export const triggerEvent = <T extends Object>(type: string, detail: T = {} as T) => (
  document.dispatchEvent(new CustomEvent(type, { detail }))
);

type ExecuteScriptConfig = Partial<{
  meta: Partial<ModFileMeta>,
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
  if (config.meta) {
    Object.assign(dom.dataset, config.meta);
  }
  document.body.appendChild(dom);

  // Inline scripts won't trigger this event.
  dom.addEventListener('load', () => {
    res(void 0);
  });

  dom.addEventListener('error', (e) => {
    rej(e);
  });

  if (typeof script !== 'string') {
    dom.src = URL.createObjectURL(script);
  } else {
    dom.innerHTML = script;
    setTimeout(() => res(void 0), 50);
  }
});

export const loadStyle = (style: string | Blob, meta?: Partial<Omit<ModFileMeta, 'timing'>>) => {
  if (typeof style === 'string') {
    const dom = document.createElement('style');
    dom.innerHTML = style;
    Object.assign(dom.dataset, meta);
    const headDOM = document.head ?? document.getElementsByTagName('head');
    headDOM.appendChild(dom);
  } else {
    const dom = document.createElement('link');
    dom.rel = 'stylesheet';
    dom.href = URL.createObjectURL(style);
    Object.assign(dom.dataset, meta);
    const headDOM = document.head ?? document.getElementsByTagName('head');
    headDOM.appendChild(dom);
  }
};

export const isValidModMeta = (obj: Partial<ModMetaFile>) => (
  obj.id !== (void 0) && obj.name !== (void 0) && obj.author !== (void 0) && obj.version !== (void 0) && semver.valid(semver.clean(obj.version))
);

export const sortMods = (a: ModMetaFull, b: ModMetaFull) => {
  const hasDepsA = a.dependencies !== (void 0) && Object.keys(a.dependencies).length > 0;
  const hasDepsB = b.dependencies !== (void 0) && Object.keys(b.dependencies).length > 0;

  if (hasDepsA !== hasDepsB) {
    return hasDepsA ? 1 : -1;
  }

  const priorityA = a.priority ?? 1000;
  const priorityB = b.priority ?? 1000;

  return priorityA - priorityB;
};

export const getFileMD5 = (file: Blob, chunkSize = 2097152): Promise<string> => new Promise((res, rej) => {
  const fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  const chunks = Math.ceil(file.size / chunkSize);
  const spark = new SparkMD5.ArrayBuffer();
  const reader = new FileReader();
  let currentChunk = 0;

  reader.onload = (e) => {
    spark.append((e.target as FileReader).result as ArrayBuffer);
    currentChunk++;

    if (currentChunk < chunks) loadChunk();
    else {
      res(spark.end());
      spark.destroy();
    }
  };

  reader.onerror = (e) => {
    rej(e);
  };

  function loadChunk() {
    const start = currentChunk * chunkSize;
    const end = (start + chunkSize) < file.size ? start + chunkSize : file.size;
    reader.readAsArrayBuffer(fileSlice.call(file, start, end));
  }

  loadChunk();
});

export const isModSuitable = (mod: ModMetaFull) => {
  const { stats, mods, version } = window.YASCML;

  if (mod.designedFor !== (void 0) && stats.gameName !== mod.designedFor) {
    console.warn(`Mod "${mod.id}" is designed for "${mod.designedFor}", but it's running on "${stats.gameName}". This mod will not be loaded.`);
    return false;
  }

  if (mod.dependencies === (void 0)) return true;
  for (const modId in mod.dependencies) {
    const modDep = mods.find(e => e.id === modId);
    if (!modDep && modId !== 'yascml') {
      console.warn(`Mod "${mod.id}" requires dependency "${modId}", but it's not installed. This mod will not be loaded.`);
      return false;
    }

    const depVersion = modId !== 'yascml' ? modDep!.version : version;
    const requiredVersion = mod.dependencies[modId];
    
    if (!semver.satisfies(depVersion, requiredVersion)) {
      console.warn(`Mod "${mod.id}" requires dependency "${modId} v${requiredVersion}", but found ${depVersion}. This mod will not be loaded.`);
      return false;
    }
  }

  return true;
};

export const unescapeHTML = (string: string) => {
  const dom = document.createElement('div');
  dom.innerHTML = string;
  return dom.innerHTML;
};
