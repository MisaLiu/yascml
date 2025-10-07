import '@yascml/types';
import * as idbKeyval from 'idb-keyval';
import JSZip from 'jszip';
import { LoaderConfig, YASCML } from './types';
export * from './types';

declare global {
  interface Window {
    JSZip?: JSZip;
    idbKeyval?: typeof idbKeyval;

    YASCML: YASCML;
    YASCMLConfig?: LoaderConfig;
    __SUGARCUBE_PATCHER?: () => (void | Promise<void>);
    __AfterInit?: (Function | Promise<unknown>)[];
  }
}
