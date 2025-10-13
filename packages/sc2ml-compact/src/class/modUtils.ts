import lodash from 'lodash';
import { buildIdbRef, buildIdbKeyvalRef } from '../ref';
import { buildLogger } from '../utils';
import type { SC2DataManager } from './dataManager';
import { _Window } from '../types';

export class ModUtils {
  readonly pSC2DataManager: SC2DataManager;
  readonly thisWin: _Window;

  constructor(dataManager: SC2DataManager, window: _Window) {
    this.pSC2DataManager = dataManager;
    this.thisWin = window;
  }

  getThisWindow() {
    return this.thisWin;
  }

  getModListName() {
    return this.pSC2DataManager.getModLoader().getModListName();
  }

  getModListNameNoAlias() {
    return this.pSC2DataManager.getModLoader().getModListName();
  }

  getAnyModByNameNoAlias(name: string) {
    return this.pSC2DataManager.getModLoader().getModCacheByNameOne(name);
  }

  getLodash() {
    return lodash;
  }

  getLogger() {
    return buildLogger();
  }

  getIdbRef() {
    return buildIdbRef();
  }

  getIdbKeyvalRef() {
    return buildIdbKeyvalRef();
  }

  get version() {
    return __VERSION__;
  }
}
