import { LogLevel, LogEntry } from '../types';

interface ConsoleMap<T extends keyof Console> extends Map<T & string, Console[T]> {};

const FnNames: (keyof Console)[] = [
  'debug',
  'log',
  'info',
  'warn',
  'error'
];

const OrigConsole: ConsoleMap<keyof Console> = new Map();

export const Logs: LogEntry[] = [];

// Patching `console`
for (const key of FnNames) {
  OrigConsole.set(key, Reflect.getOwnPropertyDescriptor(window.console, key)!.value!);
}

const customLog = (level: LogLevel, ...data: any[]) => { 
  if (!__DEVELOPMENT__ && level === 'info') return;

  const ConsoleFn = OrigConsole.get(level);
  if (!ConsoleFn) return;

  Logs.unshift({ time: performance.now(), level, data });
  if (Logs.length > 200) Logs.length = 200;

  return Reflect.apply(ConsoleFn, window.console, data);
};

for (const key of FnNames) {
  const level = key !== 'log' ? key as LogLevel : 'info';

  Reflect.defineProperty(window.console, key, {
    value(...data: any[]) {
      return customLog(level, ...data);
    }
  });
}
