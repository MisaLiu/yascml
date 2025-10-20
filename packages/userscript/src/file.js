
export const fileSelect = (config = {}) => new Promise((res) => {
  const dom = document.createElement('input');
  Object.assign(dom, config);

  dom.type = 'file';
  dom.oninput = () => res([ ...dom.files ]);

  dom.click();
});
