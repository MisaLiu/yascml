import { ModLoader } from './loader';
import { HtmlTagSrcHook } from './htmlSrcHook';
import { _Window } from '../types';

export class SC2DataManager {
  readonly thisWin: _Window;
  readonly modLoader: ModLoader;
  readonly htmlTagSrcHook: HtmlTagSrcHook;

  constructor(window: _Window) {
    this.thisWin = window;
    this.modLoader = new ModLoader(this.thisWin);
    this.htmlTagSrcHook = new HtmlTagSrcHook(this);
  }

  conflictResult = []; // TODO

  getModLoader() {
    return this.modLoader;
  }

  /**
   * Get `<tw-storydata>` node from HTML
   */
  get rootNode() {
    return document.querySelector<HTMLElement>('tw-storydata');
  }

  /**
   * Get all `<style>` nodes from story root node
   */
  get styleNode() {
    return this.rootNode ? this.rootNode.getElementsByTagName('style') : null;
  }

  /**
   * Get all `<script>` nodes from story root node
   */
  get scriptNode() {
    return this.rootNode ? this.rootNode.getElementsByTagName('script') : null;
  }

  /**
   * Get all `<tw-passagedata>` nodes from story root node
   */
  get passageDataNodeList() {
    return this.rootNode ? Array.from(this.rootNode.getElementsByTagName('tw-passagedata')) : null;
  }
};
