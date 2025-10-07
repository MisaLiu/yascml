import { replace } from '@yascml/utils';
import resources from './resources';
import PassageMiddleware, { PassageDOMCache } from './passage';
import { createPassageDOM } from './utils/twee';

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

// Hook SugarCube.Story.get()
replace(window.SugarCube!.Story, 'get', {
  value(name: string) {
    const origStory = this.$get(name);
    const context = { name, tags: origStory.tags, text: this.has(name) ? origStory.text : '' };

    PassageMiddleware.run(context);
    if (
      context.tags === origStory.tags &&
      context.text === origStory.text
    ) return origStory;

    let destDOM = PassageDOMCache.get(name);
    if (destDOM) {
      destDOM.setAttribute('tags', context.tags.join(' '));
      destDOM.innerText = context.text;
    } else {
      destDOM = createPassageDOM(context);
      PassageDOMCache.set(name, destDOM);
    }

    return new window.SugarCube!.Passage(name, destDOM);
  },
});
