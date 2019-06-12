export const ciLookup = (obj: Record<string, any>, key: string) => {
  const keys = Object.keys(obj)
  const i = keys.map(k => k.toLowerCase()).indexOf(key.toLowerCase())
  if (i !== -1) {
    return obj[keys[i]]
  }
}
