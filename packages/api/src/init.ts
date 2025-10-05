import { replace } from '@yascml/utils';
import { Passages } from './passages';

// Hook `<image>`
{
  const $src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
  Reflect.defineProperty(HTMLImageElement.prototype, 'src', {
    get() { return $src.get!.call(this) },
    set(source: string) {
      // yay let's do something here
      $src.set!.call(this, source);
    },
  });
}

// Hook SugarCube.Story.get()
replace(window.SugarCube!.Story, 'get', {
  value(name: string) {
    if (Passages.has(name)) {
      return new window.SugarCube!.Passage(name, Passages.get(name));
    }
    return this.$get(name);
  },
});
