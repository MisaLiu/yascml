import { Settings } from './types';

const STORAGE_KEY = 'yascml-settings';

const _Settings: Settings = ((savedStr: string | null) => {
  if (!savedStr) return ({
    disabledMods: [],
    saveMode: false,
    logInfo: false,
  }) as Settings;
  return JSON.parse(savedStr) as Settings;
})(localStorage.getItem(STORAGE_KEY));

const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(_Settings));

const get = <K extends keyof Settings>(key: K) => _Settings[key];

const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
  _Settings[key] = value;
  return save();
};

(() => {
  save();
})();

export {
  get,
  set,
  _Settings as _raw,
};
