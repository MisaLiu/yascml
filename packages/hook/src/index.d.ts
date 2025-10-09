import '@yascml/types';
import '@yascml/loader';
import type { YASCHook } from './types';
export * from './types';

declare global {
  interface Window {
    readonly YASCHook: YASCHook,
  }
}
