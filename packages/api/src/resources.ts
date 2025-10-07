import { OnionModelAsync } from './utils/class';

/**
 * Hooks all image loaded in this game
 * 
 * @see {@link OnionModelAsync}
 */
const image = new OnionModelAsync<{ src: string }>();

export default {
  image
};
