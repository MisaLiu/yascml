
export const readFileAsText = (file: Blob) => new Promise<string>((res, rej) => {
  const reader = new FileReader();

  reader.onload = () => {
    res(reader.result as string);
  };

  reader.onerror = (e) => {
    rej(e);
  };

  reader.readAsText(file);
});

export const readFileAsBase64 = (file: Blob) => new Promise<string>((res, rej) => {
  const reader = new FileReader();

  reader.onload = () => res(reader.result as string);
  reader.onerror = (e) => rej(e);

  reader.readAsDataURL(file);
});

export const textToBuffer = (string: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(string);
};
