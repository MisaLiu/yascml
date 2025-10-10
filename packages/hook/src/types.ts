import { PassageBase } from 'twine-sugarcube';
import passage from './passage';
import resources from './resources';

export interface Passage extends PassageBase {
  pid: number;
};

export type Middleware<C extends object> = (
  ((context: C, next: () => void) => unknown) | 
  ((context: C) => unknown)
);

export type MiddlewareAsync <C extends object> = Middleware<C> & (
  ((context: C, next: () => void) => Promise<unknown>) | 
  ((context: C) => Promise<unknown>)
);

export type YASCHook = {
  readonly passage: typeof passage;
  readonly resources: typeof resources;
};
