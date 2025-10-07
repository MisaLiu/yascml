import passage from './passages';
import resources from './resources';
import './init';

Object.defineProperty(window, 'YASCAPI', {
  configurable: false,

  value: Object.seal(Object.assign(Object.create(null), {
    passage,
    resources,
  })),
});
