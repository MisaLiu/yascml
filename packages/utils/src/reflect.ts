
export const define: typeof Reflect.defineProperty = (target, p, attributes) => {
  if (Object.hasOwn(attributes, 'value')) {
    attributes.writable = true;
  }

  return Reflect.defineProperty(target, p, {
    configurable: true,
    enumerable: true,
    ...attributes,
  });
};

type ReplaceTarget = { [name: string]: Function };

type ReplaceAttributes<T extends ReplaceTarget, P extends keyof T> = (
  Omit<PropertyDescriptor, 'value'> &
  ThisType<T & { [K in `$${string & P}`]: T[P] }> & 
  {
    value(this: T & { [K in `$${string & P}`]: T[P] }, ...args: any[]): any
  }
);

/**
 * Used to replace a funcion.
 */
export const replace = <T extends ReplaceTarget, P extends keyof T>(
  target: T,
  p: P,
  attributes: ReplaceAttributes<T, P>
) => {
  if (typeof target[p] !== 'function')
    throw new Error('Unsupported target');

  const OrigFn = target[p];

  if (!Reflect.defineProperty(target, `$${String(p)}`, {
    configurable: false,
    enumerable: false,
    value: OrigFn,
  }))
    throw new Error('Cannot define property on this target, is this target protected?');

  return Reflect.defineProperty(target, p, {
    configurable: true,
    enumerable: true,
    ...attributes,
  });
};
