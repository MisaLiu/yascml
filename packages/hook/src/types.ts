import { PassageBase } from 'twine-sugarcube';
import passage from './passage';
import resources from './resources';

export interface Passage extends PassageBase {
  pid: number;
};

export type YASCHook = {
  readonly passage: typeof passage;
  readonly resources: typeof resources;
};
