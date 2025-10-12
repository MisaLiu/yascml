import lodash from 'lodash';
import * as idb from 'idb';
import { SC2DataManager } from './class/dataManager';

declare global {
  interface Window {
    modSC2DataManager: SC2DataManager,
  }
}

if (!window.lodash) window.lodash = lodash;
if (!window.idb) window.idb = idb;

const dataManager = new SC2DataManager(window);

Object.defineProperty(window, 'modSC2DataManager', {
  value: dataManager,
});

window.__AfterInit?.push(dataManager.startInit.bind(window.modSC2DataManager));
