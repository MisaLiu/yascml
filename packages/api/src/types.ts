import { PassageBase } from 'twine-sugarcube';

export interface Passage extends PassageBase {
  pid: number;
};

export interface TWPassageDataElement extends HTMLElement {
  pid: string;
  name: string;
  tags: string;
  position: string;
  size: string;
}
