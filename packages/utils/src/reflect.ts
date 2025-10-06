
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

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T & string];

type ReplaceAttributes<T extends object, P extends FunctionKeys<T>> = (
  Omit<PropertyDescriptor, 'value'> &
  ThisType<T & { [K in `$${P}`]: T[P] }> & 
  {
    value(this: T & { [K in `$${P}`]: T[P] }, ...args: any[]): any
  }
);

/**
 * Used to replace a funcion.
 */
export const replace = <
  T extends object,
  P extends FunctionKeys<T>
>(
  target: T,
  p: P,
  attributes: ReplaceAttributes<T, P>
) => {
  const OrigFn = target[p];
  if (typeof OrigFn !== 'function')
    throw new Error('Unsupported target');

  if (!Reflect.defineProperty(target, `$${String(p)}`, {
    configurable: false,
    enumerable: false,
    value: OrigFn,
  }))
    throw new Error('Cannot define property on this target, is this target protected?');

  if (!Reflect.defineProperty(target, p, {
    configurable: true,
    enumerable: true,
    ...attributes,
  }))
    throw new Error('Cannot relace property on this target, is this target unconfigurable?');
};
