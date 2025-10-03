import { createPassageDOM } from './utils/twee';

type ReplaceContent = string | Promise<string> | ((name: string) => string | Promise<string>);

export const ReplacedPassages = new Map<string, HTMLElement>();

const addReplacedElement = (name: string, content: string) => {
  ReplacedPassages.set(name, createPassageDOM({ name, tags: [], text: content }));

  // If current passage has been replaced, refresh the current passgae.
  const currentPassageDOM = document.querySelector<HTMLDivElement>('#passages > div[data-passage]');
  if (!currentPassageDOM || !currentPassageDOM.dataset.passage) return;
  if (currentPassageDOM.dataset.passage !== name) return;
  window.SugarCube!.Engine.play(name, true);
};

/**
 * Replace a passage with given name and new content.
 * 
 * @param {string} name 
 * @param {ReplaceContent} content 
 */
const replace = async (name: string, content: ReplaceContent) => {
  if (typeof content === 'string') return addReplacedElement(name, content);
  else if (typeof content === 'function') return addReplacedElement(name, await Promise.resolve(content(name)));
  return addReplacedElement(name, await Promise.resolve(content));
};

export default {
  replace,
};
