import { replace } from '@yascml/utils';
import resources from './resources';
import { Passages } from './passages';

// Hook `<img>`
{
  const $src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
  Reflect.defineProperty(HTMLImageElement.prototype, 'src', {
    get() { return $src.get!.call(this) },
    set(source: string) {
      const context = { src: source };
      resources.image.run(context)
        .then(() => {
          $src.set!.call(this, context.src);
        });
    },
  });
}

// Hook `<image>` in SVG
// XXX: This is designed for DoL
replace(Element.prototype, 'setAttributeNS', {
  value(ns: string | null, name: string, value: string) {
    if (
      !(this instanceof SVGImageElement) ||
      (name !== 'href' && name !== 'xlink:href') ||
      !value
    ) return this.$setAttributeNS(ns, name, value);

    this.$setAttributeNS(ns, name, value);
    const context = { src: value };
    resources.image.run(context)
      .then(() => {
        this.$setAttributeNS(ns, name, context.src);
      });
  },
});

// Hook SugarCube.Story.has()
replace(window.SugarCube!.Story, 'has', {
  value(name: string) {
    if (Passages.has(name)) return true;
    return this.$has(name);
  }
});

// Hook SugarCube.Story.get()
replace(window.SugarCube!.Story, 'get', {
  value(name: string) {
    if (Passages.has(name)) {
      return new window.SugarCube!.Passage(name, Passages.get(name));
    }
    return this.$get(name);
  },
});
