/// <reference types="vite/client" />

import type { SugarCube } from '@yascml/types';
import type { YASCML } from '@yascml/loader';

declare global {
  interface Window {
    SugarCube: SugarCube;
    YASCML: YASCML;
  }
}
