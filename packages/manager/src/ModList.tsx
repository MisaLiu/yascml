import { useModList } from './useModList';

export const ModList = () => {
  const { modList } = useModList();

  return (
    <table id="mods-list">
      <tbody>
        {modList.map((mod) => (
          <tr key={mod.id}>
            <td></td>
            <td>
              <div>{mod.name}</div>
              <div class="subtitle">Author: {mod.author}</div>
            </td>
            <td>
              <button class="delete" type="button" role="button" tabIndex={0} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
