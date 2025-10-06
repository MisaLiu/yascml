import { OnionModel } from './utils/class';

/**
 * Hooks all image loaded in this game
 * 
 * @see {@link OnionModel}
 */
const image = new OnionModel<{ src: string }>();

export default {
  image
};
