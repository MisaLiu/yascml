import { SugarCube, SugarCubeInternal } from '@yascml/types';

/**
 * Initialize the SugarCube engine. This is basically a copy-paste of the original code.
 * @param sc 
 * @param sci 
 * @returns {Promise<void>} A promise.
 * @see https://github.com/tmedwards/sugarcube-2/blob/9e62a6f177fcb8de17e073ad8b81f19129e5e5ee/src/sugarcube.js#L40
 */
export const initSugarCube = (sc: SugarCube, sci: SugarCubeInternal): Promise<void> => {
  return new Promise((res) => {
    if (document.normalize) {
      document.normalize();
    }

    if (sc.Story.load) sc.Story.load();
    else sc.Story.init();

    sci.$init.initStorage();

    sc.Dialog.init();
    sc.UIBar.init();
    sc.Engine.init();
    if (sci.Outlines) sci.Outlines.init();

    if (sc.Engine.runUserScripts) sc.Engine.runUserScripts();

    sc.L10n.init();

    if (!sc.session!.has('rcWarn') && sc.storage!.name === 'cookie') {
			sc.session!.set('rcWarn', 1);
			window.alert(sc.L10n.get('warningNoWebStorage'));
		}

    sc.Save.init();
    sc.Setting.init();
    sc.Macro.init();

    const $window   = jQuery(window);
		const vpReadyId = setInterval(() => {
			if ($window.width() && (sci.LoadScreen.size == null || sci.LoadScreen.size <= 1)) {
				clearInterval(vpReadyId);
				res(void 0);
			}
		}, sc.Engine.DOM_DELAY ?? sc.Engine.minDomActionDelay);
  }).then(() => {
    if (sc.Engine.runUserInit) sc.Engine.runUserInit();
    sc.UIBar.start();
    sc.Engine.start();

    // TODO: Fix this
    // @ts-expect-error
    jQuery.event.trigger({ type : ':storyready' });
  });
};
