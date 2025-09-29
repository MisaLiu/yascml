import { useEffect, useState } from 'preact/hooks';

export const useModList = () => {
  const [ modList, setModList ] = useState(window.YASCML.mods);

  const handleModListUpdate = () => {
    setModList([ ...window.YASCML.mods ]);
  };

  useEffect(() => {
    document.addEventListener('$modadded', handleModListUpdate);
    document.addEventListener('$modremoved', handleModListUpdate);
    document.addEventListener('$modenabled', handleModListUpdate);
    document.addEventListener('$moddisabled', handleModListUpdate);

    return () => {
      document.removeEventListener('$modadded', handleModListUpdate);
      document.removeEventListener('$modremoved', handleModListUpdate);
      document.removeEventListener('$modenabled', handleModListUpdate);
      document.removeEventListener('$moddisabled', handleModListUpdate);
    };
  }, []);

  return {
    modList
  };
};
