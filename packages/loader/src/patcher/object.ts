
class FnMap<T extends Object, K extends keyof T = keyof T> extends Map<K, T[K]> {};

const OrigFn = new FnMap<ObjectConstructor>();

const CustomCreate = (proto: object | null, properties?: PropertyDescriptorMap & ThisType<any>) => {
  const ObjCreate = (OrigFn.get('create') ?? Object.create) as ObjectConstructor['create'];

  if (proto === null && properties) {
    const _prop = { ...properties };
    for (const key in _prop) {
      if (!_prop[key].get && !_prop[key].set) {
        _prop[key].writable = true;
      }

      _prop[key].configurable = true;
      _prop[key].enumerable = true;
    }
    return ObjCreate({}, _prop);
  }

  return ObjCreate(proto, properties!);
};

export const patchObject = () => {
  OrigFn.set('create', Object['create']);
  OrigFn.set('freeze', Object['freeze']);
  OrigFn.set('preventExtensions', Object['preventExtensions']);

  Reflect.defineProperty(Object, 'create', {
    value: CustomCreate,
  });

  Reflect.defineProperty(Object, 'freeze', {
    value(object: object) {
      return object;
    },
  });

  Reflect.defineProperty(Object, 'preventExtensions', {
    value(object: object) {
      return object;
    },
  });
};

export const unpatchObject = () => {
  Reflect.defineProperty(Object, 'create', {
    value: OrigFn.get('create')!,
  });

  Reflect.defineProperty(Object, 'freeze', {
    value: OrigFn.get('freeze')!,
  });

  Reflect.defineProperty(Object, 'preventExtensions', {
    value: OrigFn.get('preventExtensions')!,
  });
};
