import lodash from 'lodash';
import * as idb from 'idb';
import '@yascml/loader';

declare global {
  interface Window {
    lodash?: typeof lodash;
    idb?: typeof idb;
  }
}
