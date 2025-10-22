import { replace } from '@yascml/utils';
import resources from './resources';
import PassageMiddleware from './passage';
import { EmptyImageUrl } from './const';

{ // Hook image loading
  // Hook `<img>`
  const $src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
  Reflect.defineProperty(HTMLImageElement.prototype, 'src', {
    get() { return $src.get!.call(this) },
    set(source: string) {
      if (this._src != null) {
        $src.set!.call(this, source);
        return;
      }

      const context = { src: source, element: this };
      resources.image.run(context)
        .then(() => {
          $src.set!.call(this, context.src);
        });
    },
  });

  // To prevent duplicated <img> element
  const imgDomSet = new Set<HTMLImageElement>();
  let domSetTimeout: ReturnType<typeof setTimeout> | null = null;

  const buildDomSetClear = () => {
    if (domSetTimeout !== null) clearTimeout(domSetTimeout);
    domSetTimeout = setTimeout(() => {
      imgDomSet.clear();
      domSetTimeout = null;
    }, 200);
  };

  // Hook SugarCube.Wikifier
  const $subWikify = Reflect.getOwnPropertyDescriptor(window.SugarCube!.Wikifier.prototype, 'subWikify')!;
  Reflect.defineProperty(window.SugarCube!.Wikifier.prototype, 'subWikify', {
    value(output: Element, terminator?: string, options?: Object) {
      $subWikify.value!.call(this, output, terminator, options);
      if (!output.querySelectorAll) return;

      const imgDomList = output.querySelectorAll<HTMLImageElement>('img[src]');
      if (imgDomList.length === 0) return;

      let validDomCount = 0;
      imgDomList.forEach((dom) => {
        if (imgDomSet.has(dom)) return;
        imgDomSet.add(dom);
        validDomCount++;

        dom._src = dom.getAttribute('src') ?? '';
        dom.src = EmptyImageUrl;

        const context = { src: dom._src, element: dom };
        resources.image.run(context)
          .then(() => {
            dom.src = context.src;
            delete dom._src;
          });
      });

      if (validDomCount !== 0) buildDomSetClear();
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
    const context = { src: value, element: this };
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
