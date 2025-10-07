import passage from './passage';
import resources from './resources';
import './init';

Object.defineProperty(window, 'YASCHook', {
  configurable: false,

  value: Object.seal(Object.assign(Object.create(null), {
    passage,
    resources,
  })),
});
