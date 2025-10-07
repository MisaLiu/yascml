import { _Window } from '../types';

export class ModLoader {
  readonly thisWin: _Window;

  constructor(window: _Window) {
    this.thisWin = window;
  }

  getModListName() {
    return this.thisWin.YASCML.mods.map(e => e.name);
  }

  getModCacheByNameOne(name: string) {
    const index = this.thisWin.YASCML.mods.findIndex(e => e.name === name);
    if (index === -1) return null;
    return this.thisWin.YASCML.mods[index];
  }
}
