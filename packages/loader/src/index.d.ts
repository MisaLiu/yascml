import { LoaderConfig, YASCML } from './types';
export * from './types';

declare global {
  interface Window {
    YASCML: YASCML;
    YASCMLConfig?: LoaderConfig;
  }
}
