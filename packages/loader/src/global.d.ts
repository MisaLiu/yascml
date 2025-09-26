import { YASCML } from './types';

declare global {
  interface Window {
    YASCML: YASCML;
  }
}
