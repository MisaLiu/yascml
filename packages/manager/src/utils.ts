
export const checkElementVisible = (e: HTMLElement) => {
  const { width, height } = e.getBoundingClientRect();
  return (width > 0 && height > 0);
};

export const isElementVisible = (selector: string, checkParent = false) => {
  const dom = document.querySelector<HTMLElement>(selector);
  if (!dom) return false;

  if (checkParent) {
    const parent = dom.parentElement as HTMLElement;
    if (!parent) return false;

    return checkElementVisible(parent);
  } else {
    return checkElementVisible(dom);
  }
};
