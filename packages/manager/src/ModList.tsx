import { Fragment } from 'preact/jsx-runtime';
import { useModList } from './useModList';
import { ModActinos } from './ModActions';
import type { ModAuthor as TModAuthor } from '@yascml/loader';

const InlineHr = () => <span class="hr">|</span>;

const ModAuthor = ({ info }: { info: TModAuthor }) => {
  return (
    <span>
      {typeof info === 'object' ? (
        info.url ? (
          <a href={info.url} target="_blank">{info.name}</a>
        ) : info.name
      ) : info}
    </span>
  );
};

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
    <>
      <h2>Mod List</h2>
      <table id="mods-list">
        <tbody>
          {modList.map((mod) => (
            <tr key={mod.id} class={mod.deleted ? 'deleted' : ''}>
              <td>
                <button
                  class={mod.enabled ? 'enabled' : 'disabled'}
                  type="button"
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleEnabled(mod.id)}
                  disabled={mod.deleted}
                />
              </td>
              <td>
                <div>
                  {mod.name} v{mod.version}
                  {mod.new && <span class="mod-label new">new</span>}
                  {mod.updated && <span class="mod-label new">updated</span>}
                </div>
                <div class="subtitle">
                  Author: {
                    Array.isArray(mod.author) ? (
                      mod.author.map((author, i, a) => {
                        const key = typeof author === 'string' ? author : author.name;
                        return (
                          <Fragment key={`${mod.id}-author-${key}`}>
                            <ModAuthor info={author} />
                            {i < a.length - 1 && <InlineHr />}
                          </Fragment>
                        );
                      })
                    ) : <ModAuthor info={mod.author} />
                  }
                  {mod.homepageURL && <>
                    <InlineHr />
                    <span>
                      <a href={mod.homepageURL} target="_blank">Homepage</a>
                    </span>
                  </>}
                  {mod.donateURL && <>
                    <InlineHr />
                    <span>
                      <a href={mod.donateURL} target="_blank">Donate</a>
                    </span>
                  </>}
                </div>
              </td>
              <td>
                <button
                  class="delete"
                  type="button"
                  role="button"
                  tabIndex={0}
                  disabled={mod.embedded || mod.deleted}
                  onClick={() => deleteMod(mod.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModActinos />
    </>
  );
};
