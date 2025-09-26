import * as SC from 'twine-sugarcube';
import { SimpleStorageAdapter } from './internal';

export type SugarCube = {
  Config: SC.ConfigAPI,
  Dialog: SC.DialogAPI,
  Engine: SC.EngineAPI,
  Fullscreen: SC.FullscreenAPI,
  Macro: SC.MacroAPI,
  Passage: SC.Passage,
  Save: SC.SaveAPI,
  Scripting: SC.ScriptingAPI,
  Setting: SC.SettingsAPI,
  SimpleAudio: SC.SimpleAudioAPI,
  State: SC.StateAPI,
  Story: SC.StoryAPI,
  UI: SC.UIAPI,
  UIBar: SC.UIBarAPI,
  Wikifier: SC.WikifierAPI,
  session: SimpleStorageAdapter | null,
  settings: SC.SettingsAPI,
  storage: SimpleStorageAdapter | null,
};
