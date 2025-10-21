import { render } from 'preact';
import { App } from './app';
import { isElementVisible } from './utils';

const dialogContent = document.createElement('div');

const showManagerDialog = () => {
  const dialog = ((title, className) => {
    if (!!window.SugarCube!.Dialog.create) return window.SugarCube!.Dialog.create(title, className);
    window.SugarCube!.Dialog.setup(title, className);
    return window.SugarCube!.Dialog;
  })('YASCML Manager', 'yascmanager');

  dialog.body().appendChild(dialogContent);
  dialog.open();
};

const buildManagerEntry = () => {
  const liDOM = document.createElement('li');
  const triggerDOM = document.createElement('a');

  liDOM.id = 'menu-item-yascmanager';

  triggerDOM.tabIndex = 0;
  triggerDOM.role = 'button';
  triggerDOM.innerText = 'YASCML Manager';
  triggerDOM.onclick = showManagerDialog;

  liDOM.appendChild(triggerDOM);
  return liDOM;
};

const buildManagerEntrySide = () => {
  const dom = document.createElement('button');
  dom.id = 'ui-bar-yascmanager';
  dom.title = 'YASCML Manager';
  dom.onclick = showManagerDialog;

  const toggleDOM = document.querySelector<HTMLButtonElement>('#ui-bar-toggle');
  if (toggleDOM) {
    const clientRect = toggleDOM.getBoundingClientRect();
    dom.style.setProperty('--top', `${clientRect.height - 1}px`);
  }

  return dom;
};

const buildManagerEntryEdge = () => {
  const dom = document.createElement('div');
  dom.id = 'edge-yascmanager';
  dom.title = 'YASCML Manager';
  dom.onclick = showManagerDialog;
  return dom;
};

(() => {
  render(<App />, dialogContent);
  
  document.addEventListener('$gamestarted', () => {
    if (isElementVisible('#menu-yascml', true)) {
      document.querySelector('#menu-yascml')!.appendChild(buildManagerEntry());
    } else if (isElementVisible('#ui-bar-toggle')) {
      document.querySelector('#ui-bar-tray')!.appendChild(buildManagerEntrySide());
    } else {
      document.body.appendChild(buildManagerEntryEdge());
    }
  });
})();
