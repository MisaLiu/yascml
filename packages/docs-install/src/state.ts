import { create } from 'zustand';

export type GlobalState = {
  gameFile?: File,
  embeddedMods: string[],
  customExports: string[],
  customInits: Record<string, string>,
};

type $GlobalState = GlobalState & {
  readonly setGameFile: (file: File) => void;
  readonly setEmbeddedMods: (paths: string[]) => void;
  readonly setCustomExports: (names: string[]) => void;
  readonly setCustomInits: (inits: Record<string, string>) => void;
};

export const useGlobalState = create<$GlobalState>((set) => ({
  embeddedMods: [ 'yascmanager.zip' ],
  customExports: [],
  customInits: {},

  setGameFile: (file) => set({
    gameFile: file,
  }),

  setEmbeddedMods: (paths) => set({
    embeddedMods: paths,
  }),

  setCustomExports: (names) => set({
    customExports: names,
  }),

  setCustomInits: (inits) => set({
    customInits: inits,
  }),
}));
