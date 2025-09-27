import { YASCML } from '../types';
import api from '../api';

/**
 * Initialize the loader.
 */
export const initLoader = () => {
  Object.defineProperty(window, 'YASCML', {
    configurable: false,

    value: Object.seal(Object.assign(Object.create(null), {
      version: __LOADER_VERSION__,
      mods: [],
      api,
    } as YASCML)),
  });
};
