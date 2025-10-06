import { createPassageDOM } from './utils/twee';

type PassageContent = string | Promise<string> | ((name: string) => string | Promise<string>);

export const Passages = new Map<string, HTMLElement>();

const addReplacedElement = (name: string, content: string, tags: string[]) => {
  Passages.set(name, createPassageDOM({ name, tags, text: content }));

  // If current passage has been replaced, refresh the current passgae.
  const currentPassageDOM = document.querySelector<HTMLDivElement>('#passages > div[data-passage]');
  if (!currentPassageDOM || !currentPassageDOM.dataset.passage) return;
  if (currentPassageDOM.dataset.passage !== name) return;
  window.SugarCube!.Engine.play(name, true);
};

/**
 * Add a new passage to the game.
 * 
 * @param {string} name 
 * @param {PassageContent} content 
 */
const add = async (name: string, content: PassageContent, tags: string[] = []) => {
  if (typeof content === 'string') return Passages.set(name, createPassageDOM({ name, tags, text: content }));
  else if (typeof content === 'function') return Passages.set(name, createPassageDOM({ name, tags, text: await Promise.resolve(content(name)) }));
  return Passages.set(name, createPassageDOM({ name, tags, text: await Promise.resolve(content) }));
};

/**
 * Replace a passage with given name and new content.
 * 
 * @param {string} name 
 * @param {PassageContent} content 
 */
const replace = async (name: string, content: PassageContent, tags: string[] = []) => {
  if (typeof content === 'string') return addReplacedElement(name, content, tags);
  else if (typeof content === 'function') return addReplacedElement(name, await Promise.resolve(content(name)), tags);
  return addReplacedElement(name, await Promise.resolve(content), tags);
};

export default {
  add,
  replace,
};
