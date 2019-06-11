export const stringComparer = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' })
