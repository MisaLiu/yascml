import * as SC from 'twine-sugarcube';
import { SimpleStorageAdapter } from './internal';

export interface PassageClass extends SC.Passage {
  new (name: string, element?: HTMLElement): this;
};

export type L10nAPI = {
  init(): void;

  get(id: string, overrides?: Record<string, string>): string;
  get(ids: string[], overrides?: Record<string, string>): string;
};

export type VersionAPI = {
  short(): string;
  long(): string;
};

export type SugarCube = {
  Config: SC.ConfigAPI,

  Dialog: SC.DialogAPI & {
    init(): void;
  },

  Engine: SC.EngineAPI & {
    init(): void;
    start(): void;

    runUserScripts?(): void;
    runUserInit?(): void;

    DOM_DELAY?: number;
    minDomActionDelay: number;
  },

  Fullscreen: SC.FullscreenAPI,

  L10n: L10nAPI,

  Macro: SC.MacroAPI & {
    init(): void;
  },

  Passage: PassageClass,

  Save: SC.SaveAPI & {
    init(): void;
  },
  
  Scripting: SC.ScriptingAPI,

  Setting: SC.SettingsAPI & {
    init(): void;
  },

  SimpleAudio: SC.SimpleAudioAPI,

  State: SC.StateAPI,

  Story: SC.StoryAPI & {
    load?(): void;
    init(): void;
  },

  UI: SC.UIAPI,

  UIBar: SC.UIBarAPI & {
    init(): void;
    start(): void;
  },

  Wikifier: SC.WikifierAPI,
  session: SimpleStorageAdapter | null,
  settings: SC.SettingsAPI,
  storage: SimpleStorageAdapter | null,
  version: VersionAPI,
};
