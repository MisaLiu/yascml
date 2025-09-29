import { useModList } from './useModList';

export const ModList = () => {
  const { modList } = useModList();

  const toggleEnabled = (id: string) => {
    const mod = window.YASCML.api.mod.get(id);
    if (mod.enabled) window.YASCML.api.mod.disable(id);
    else window.YASCML.api.mod.enable(id);
  }

  const deleteMod = (id: string) => {
    window.YASCML.api.mod.remove(id);
  };

  return (
    <table id="mods-list">
      <tbody>
        {modList.map((mod) => (
          <tr key={mod.id}>
            <td>
              <button
                class={mod.enabled ? 'enabled' : 'disabled'}
                type="button"
                role="button"
                tabIndex={0}
                onClick={() => toggleEnabled(mod.id)}
              />
            </td>
            <td>
              <div>{mod.name}</div>
              <div class="subtitle">Author: {mod.author}</div>
            </td>
            <td>
              <button
                class="delete"
                type="button"
                role="button"
                tabIndex={0}
                onClick={() => deleteMod(mod.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
