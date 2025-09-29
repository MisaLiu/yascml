import { LoaderConfig, YASCML } from './types';

declare global {
  interface Window {
    YASCML: YASCML;
    YASCMLConfig?: LoaderConfig;
  }
}
