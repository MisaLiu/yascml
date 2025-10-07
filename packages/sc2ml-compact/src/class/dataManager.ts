import { ModLoader } from './loader';
import { _Window } from '../types';

export class SC2DataManager {
  readonly thisWin: _Window;
  readonly modLoader: ModLoader;

  constructor(window: _Window) {
    this.thisWin = window;
    this.modLoader = new ModLoader(this.thisWin);
  }

  getModLoader() {
    return this.modLoader;
  }
};
