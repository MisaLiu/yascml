import { get, set } from './storage';

export const addDisabledMod = (modId: string) => {
  const disabledMods = get('disabledMods');
  if (disabledMods.findIndex(e => e === modId) !== -1) return;
  return set('disabledMods', [ ...disabledMods, modId ]);
};

export const removeDisabledMod = (modId: string) => {
  const disabledMods = get('disabledMods');
  if (disabledMods.findIndex(e => e === modId) === -1) return;
  return set('disabledMods', disabledMods.filter(e => e !== modId));
};

export const enableSaveMode = () => {
  return set('saveMode', true);
};

export const disableSaveMode = () => {
  return set('saveMode', false);
};
