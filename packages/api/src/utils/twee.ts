import { Passage, TWPassageDataElement } from '../types';

export const createPassageDOM = ({
  name,
  tags,
  text,
}: Omit<Passage, 'pid' | 'title'>) => {
  const dom = document.createElement('tw-passagedata') as TWPassageDataElement;
  const _text = document.createTextNode(text);
  dom.name = name;
  dom.tags = tags.join(' ');

  dom.setAttribute('name', name);
  dom.setAttribute('tags', tags.join(' '));

  dom.appendChild(_text);
  return dom;
};

export const unescapeTweeHeader = (value: string) => (
  value.replace(/\\([[\]{}])/g, '$1').replace(/\\\\/g, '\\')
);

/**
 * Parse *.twee sources to `<tw-passagedata>` tags.
 * 
 * @param {string} source
 * @see https://github.com/klembot/twinejs/blob/179e6136b2fb9697c8eec10d048572e0b53dc0be/src/util/twee.ts#L50
 */
export const parseTweeToDOM = (source: string) => {
  const result: TWPassageDataElement[] = [];
  const blocks = source.split(/(?:[\r\n]{1,2}){3}/);

  for (const block of blocks) {
    const [ headerLine, ...lines ] = block.split(/[\r\n]{1,2}/);
    
    const headerBits = /^::\s*(.*?(?:\\\s)?)\s*(\[.*?\])?\s*(\{.*?\})?\s*$/.exec(
      headerLine
    );
    if (!headerBits) continue;
    
    const [, _rawName, rawTags, ] = headerBits;
    const rawName = _rawName?.trim();
    if (!rawName)
      throw new Error(`Passage name couldn't be found in header line: ${headerLine}`);
    if (rawName === 'StoryTitle') continue;
    if (rawName === 'StoryData') continue;

    const tags: string[] = [];
    if (rawTags && rawTags.trim()) {
      tags.join(
        ...rawTags.trim().match(/^\[(.+)\]$/)![1].split(/\s/)
      );
    }

    result.push(
      createPassageDOM({
        name: unescapeTweeHeader(
          rawName
        ),
        tags,
        text: lines.join('\n').trim(),
      })
    );
  };

  return result;
};
