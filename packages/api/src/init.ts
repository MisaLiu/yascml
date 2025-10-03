import { replace } from '@yascml/utils';
import { ReplacedPassages } from './passages';

// Hook SugarCube.Story.get()
replace(window.SugarCube!.Story, 'get', {
  value(name: string) {
    if (ReplacedPassages.has(name)) {
      return new window.SugarCube!.Passage(name, ReplacedPassages.get(name));
    }
    return this.$get(name);
  },
});
