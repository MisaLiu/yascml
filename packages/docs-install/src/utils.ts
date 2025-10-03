
export const toFirstUpper = (string: string) => (
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`
);

export const toFirstLower = (string: string) => (
  `${string.charAt(0).toLowerCase()}${string.slice(1)}`
);

export const downloadFile = (url: string, filename?: string) => (
  fetch(url)
    .then(e => e.blob())
    .then((blob) => {
      const urlSplit = url.split('/');
      const urlEnd = urlSplit[urlSplit.length - 1];
      return new File([blob], filename ?? urlEnd);
    })
);
