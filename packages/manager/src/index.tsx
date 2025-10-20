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

(() => {
  render(<App />, dialogContent);
  
  document.addEventListener('$gamestarted', () => {
    const menuDOM = document.querySelector<HTMLDivElement>('#menu-yascml');
    const isMenuVisible = ((dom) => {
      if (!dom) return false;
    
      const parent = dom.parentElement;
      if (!parent) return false;
    
      const bounding = parent.getBoundingClientRect();
      if (bounding.width === 0 || bounding.height === 0) return false;

      return true;
    })(menuDOM);

    if (isMenuVisible) {
      menuDOM!.appendChild(buildManagerEntry());
    } else {
      document.querySelector('#ui-bar-tray')?.appendChild(buildManagerEntrySide());
    }
  });
})();
