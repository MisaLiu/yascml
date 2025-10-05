import { replace } from '@yascml/utils';
import { Passages } from './passages';

// Hook SugarCube.Story.get()
replace(window.SugarCube!.Story, 'get', {
  value(name: string) {
    if (Passages.has(name)) {
      return new window.SugarCube!.Passage(name, Passages.get(name));
    }
    return this.$get(name);
  },
});
