import { PassageBase } from 'twine-sugarcube';
import { OnionModel } from './utils/class';
import QuickLRU from 'quick-lru';

export const PassageDOMCache = new QuickLRU<string, HTMLElement>({
  maxSize: 20,
});

const PassageMiddleware = new OnionModel<Omit<PassageBase, 'title'>>();

export default PassageMiddleware;
