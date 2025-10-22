import '@yascml/types';
import '@yascml/loader';
import type { YASCHook } from './types';
export * from './types';

declare global {
  interface Window {
    readonly YASCHook: YASCHook,
  }

  interface HTMLImageElement {
    /**
     * Internal property. Set to any string to prevent `YASCHook.resources.image` processing it.
     */
    _src?: string;
  }
}
