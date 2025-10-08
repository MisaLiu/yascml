import { PassageBase } from 'twine-sugarcube';
import { OnionModel } from './utils/class';

const PassageMiddleware = new OnionModel<Omit<PassageBase, 'title'>>();

export default PassageMiddleware;
