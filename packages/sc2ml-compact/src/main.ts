import lodash from 'lodash';
import * as idb from 'idb';
import { SC2DataManager } from './class/dataManager';

if (!window.lodash) window.lodash = lodash;
if (!window.idb) window.idb = idb;

const dataManager = new SC2DataManager(window);

Object.defineProperty(window, 'modSC2DataManager', {
  value: dataManager,
});

window.__AfterInit?.push(dataManager.startInit);
