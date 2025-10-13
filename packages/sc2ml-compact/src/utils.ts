import { Logger } from './types';

export const buildLogger = (): Logger => ({
  log: () => (void 0), 
  warn: (...args) => console.warn(...args),
  error: (...error) => console.error(...error),
});
