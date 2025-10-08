import { replace } from '@yascml/utils';
import resources from './resources';
import PassageMiddleware from './passage';

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

// Hook SugarCube.Passage
{
  const $text = Object.getOwnPropertyDescriptor(window.SugarCube!.Passage.prototype, 'text')!;
  Reflect.defineProperty(window.SugarCube!.Passage.prototype, 'text', {
    get() {
      const context = {
        text: $text.get!.call(this),
        name: this.name ?? this.title,
        tags: this.tags,
      };

      PassageMiddleware.run(context);
      return context.text;
    },
  });
}
