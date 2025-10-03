
export const toFirstUpper = (string: string) => (
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`
);

export const toFirstLower = (string: string) => (
  `${string.charAt(0).toLowerCase()}${string.slice(1)}`
);
