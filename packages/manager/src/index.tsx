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

(() => {
  render(<App />, dialogContent);

  document.querySelector('#menu-yascml')?.appendChild(buildManagerEntry());
})();
