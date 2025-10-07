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
 * Add a passage with given name. Could be used to replace a passage too.
 * If passage with a same name exists, this will replace it.
 * 
 * @param {string} name 
 * @param {PassageContent} content 
 */
const add = async (name: string, content: PassageContent, tags: string[] = []) => {
  if (typeof content === 'string') return addReplacedElement(name, content, tags);
  else if (typeof content === 'function') return addReplacedElement(name, await Promise.resolve(content(name)), tags);
  return addReplacedElement(name, await Promise.resolve(content), tags);
};

/**
 * Get replaced passage DOM with given name
 * 
 * @param {string} name 
 */
const get = (name: string) => {
  if (!Passages.has(name)) return null;
  return Passages.get(name)!;
};

/**
 * Remove a replaced passage with given name
 * 
 * @param {string} name 
 */
const remove = (name: string) => {
  return Passages.delete(name);
};

export default {
  add,
  get,
  remove,
};
