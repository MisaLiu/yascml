import { ModLoader } from './loader';
import { HtmlTagSrcHook } from './htmlSrcHook';
import { _Window } from '../types';

export class SC2DataManager {
  readonly thisWin: _Window;
  readonly modLoader: ModLoader;
  readonly htmlTagSrcHook: HtmlTagSrcHook;

  constructor(window: _Window) {
    this.thisWin = window;
    this.modLoader = new ModLoader(this.thisWin);
    this.htmlTagSrcHook = new HtmlTagSrcHook(this);
  }

  conflictResult = []; // TODO

  getModLoader() {
    return this.modLoader;
  }
};
