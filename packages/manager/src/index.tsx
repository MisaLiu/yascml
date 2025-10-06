import { render } from 'preact';
import { App } from './app';

const dialogContent = document.createElement('div');

const showManagerDialog = () => {
  const dialog = window.SugarCube!.Dialog.create('YASCML Manager', 'yascmanager');
  dialog.body().appendChild(dialogContent);
  dialog.open();
};

const buildManagerEntry = () => {
  const liDOM = document.createElement('li');
  const triggerDOM = document.createElement('a');

  triggerDOM.tabIndex = 0;
  triggerDOM.role = 'button';
  triggerDOM.innerText = 'Manager';
  triggerDOM.onclick = showManagerDialog;

  liDOM.appendChild(triggerDOM);
  return liDOM;
};

const buildManagerEntrySide = () => {
  const dom = document.createElement('button');
  dom.id = 'ui-bar-yascmanager';
  dom.onclick = showManagerDialog;
  return dom;
}

(() => {
  render(<App />, dialogContent);

  const menuDOM = document.querySelector<HTMLDivElement>('#menu-yascml');
  const isMenuVisible = ((dom) => {
    if (!dom) return false;

    const bounding = dom.getBoundingClientRect();
    if (bounding.width === 0 || bounding.height === 0) return false;

    return true;
  })(menuDOM);

  if (isMenuVisible) {
    menuDOM!.appendChild(buildManagerEntry());
  } else {
    document.querySelector('#ui-bar-tray')?.appendChild(buildManagerEntrySide());
  }
})();
