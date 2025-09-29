
const buildManagerEntry = () => {
  const liDOM = document.createElement('li');
  const triggerDOM = document.createElement('a');

  triggerDOM.tabIndex = 0;
  triggerDOM.role = 'button';
  triggerDOM.innerText = 'Manager';

  liDOM.appendChild(triggerDOM);
  return liDOM;
};

(() => {
  document.querySelector('#menu-yascml')?.appendChild(buildManagerEntry());
})();
