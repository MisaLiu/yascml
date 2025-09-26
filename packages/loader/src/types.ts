
// TODO
export type ModInfo = {
  id: string,
  name: string,
  author: string,
  icon?: string,
  homepageURL?: string,
  donateURL?: string,
};

export type YASCML = {
  version: string,
  plugins: ModInfo[], // TODO
};
