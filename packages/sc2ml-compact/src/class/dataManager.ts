import { ModLoader } from './loader';
import { SC2DataInfoCache } from './dataInfo';
import { HtmlTagSrcHook } from './htmlSrcHook';
import { buildLogger } from '../utils';
import { _Window } from '../types';

export class SC2DataManager {
  readonly thisWin: _Window;
  readonly modLoader: ModLoader;
  readonly htmlTagSrcHook: HtmlTagSrcHook;

  /**
   * Is this data manager has been initialized?
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L247
   */
  startInitOk = false;
  
  /**
   * Game data modified by mods.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L302
   */
  cSC2DataInfoAfterPatchCache?: SC2DataInfoCache;

  /**
   * Original game data.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L133
   */
  originSC2DataInfoCache?: SC2DataInfoCache;

  constructor(window: _Window) {
    this.thisWin = window;
    this.modLoader = new ModLoader(this.thisWin);
    this.htmlTagSrcHook = new HtmlTagSrcHook(this);
  }

  conflictResult = []; // TODO

  /**
   * Clear {@link originSC2DataInfoCache|SC2DataManager.originSC2DataInfoCache}.
   * We won't clear {@link cSC2DataInfoAfterPatchCache|SC2DataManager.cSC2DataInfoAfterPatchCache} since
   * we need to use these data later.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L143
   */
  cleanAllCacheAfterModLoadEnd() {
    if (this.originSC2DataInfoCache) {
      this.originSC2DataInfoCache.clean();
      this.originSC2DataInfoCache.destroy();
      this.originSC2DataInfoCache = (void 0);
    }
  }

  /**
   * Read current game data and return a {@link SC2DataInfoCache} based on it.
   * 
   * @returns {SC2DataInfoCache}
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L118
   */
  createNewSC2DataInfoFromNow() {
    return new SC2DataInfoCache(
      buildLogger(),
      'orgin', // https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L121
      Array.from(this.scriptNode!),
      Array.from(this.styleNode!),
      this.passageDataNodeList!,
    );
  }

  /**
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L135
   */
  earlyResetSC2DataInfoCache() {
    this.initSC2DataInfoCache();
    this.flushAfterPatchCache();
  }

  /**
   * (Re)create {@link cSC2DataInfoAfterPatchCache|SC2DataManager.cSC2DataInfoAfterPatchCache}.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L326
   */
  flushAfterPatchCache() {
    if (this.cSC2DataInfoAfterPatchCache) {
      this.cSC2DataInfoAfterPatchCache.destroy();
      this.cSC2DataInfoAfterPatchCache = (void 0);
    }
    this.getSC2DataInfoAfterPatch();
  }

  /**
   * Get {@link htmlTagSrcHook|SC2DataManager.htmlTagSrcHook}.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L235
   */
  getHtmlTagSrcHook() {
    return this.htmlTagSrcHook;
  }

  /**
   * Get {@link modLoader|SC2DataManager.modLoader}.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L183
   */
  getModLoader() {
    return this.modLoader;
  }

  /**
   * Create {@link cSC2DataInfoAfterPatchCache|SC2DataManager.cSC2DataInfoAfterPatchCache}.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L308
   */
  getSC2DataInfoAfterPatch() {
    this.initSC2DataInfoCache();
    if (!this.cSC2DataInfoAfterPatchCache) {
      this.cSC2DataInfoAfterPatchCache = new SC2DataInfoCache(
        buildLogger(),
        'orgin',
        Array.from(this.scriptNode!),
        Array.from(this.styleNode!),
        this.passageDataNodeList!,
      );
    }
    return this.cSC2DataInfoAfterPatchCache;
  }

  /**
   * Get (or create) {@link originSC2DataInfoCache|SC2DataManager.originSC2DataInfoCache}.
   * 
   * @returns {SC2DataInfoCache}
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L170
   */
  getSC2DataInfoCache() {
    this.initSC2DataInfoCache();
    return this.originSC2DataInfoCache!;
  }

  /**
   * Create {@link originSC2DataInfoCache|SC2DataManager.originSC2DataInfoCache}.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L152
   */
  initSC2DataInfoCache() {
    if (!this.originSC2DataInfoCache) {
      this.originSC2DataInfoCache = new SC2DataInfoCache(
        buildLogger(),
        'orgin',
        Array.from(this.scriptNode!),
        Array.from(this.styleNode!),
        this.passageDataNodeList!,
      );
    }
  }

  /**
   * Generate a `<tw-passagedata>` DOM with given passage data.
   * 
   * @deprecated We don't need this so it's not implemented.
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L447
   */
  makePassageNode() {}

  /**
   * Generate user script DOM with given script data.
   * 
   * @deprecated We don't need this so it's not implemented.
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L480
   */
  makeScriptNode() {}

  /**
   * Generate user style DOM with given style data.
   * 
   * @deprecated We don't need this so it's not implemented.
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L467
   */
  makeStyleNode() {}

  /**
   * Patch modified game data to game DOMs.
   * 
   * @deprecated We don't need this so it's not implemented.
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L355
   */
  patchModToGame() {}
  
  /**
   * Remove exists passage DOMs and add given passage DOMs.
   * 
   * @deprecated We don't need this so it's not implemented.
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L525
   */
  rePlacePassage() {}

  /**
   * Initialize this data manager.
   * 
   * @see https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/blob/8a858233f30eaa0617454cf7c14448643c06d2b6/src/BeforeSC2/SC2DataManager.ts#L249
   */
  startInit() {
    if (this.startInitOk) return;
    this.startInitOk = true;

    this.initSC2DataInfoCache();

    // ... Load mods
    // ... Check mod dependencies
    // ... Update mod conflict results
    // ... Patching modified game data to DOM
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
    return this.rootNode ? Array.from(this.rootNode.getElementsByTagName('tw-passagedata') as HTMLCollectionOf<HTMLElement>) : null;
  }
};
