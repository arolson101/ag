import isUrl from 'is-url'
import urlRegex from 'url-regex'

export { isUrl }

export const fixUrl = (from: string): string => {
  if (!from) {
    return from
  }

  const urlMatches = from.match(urlRegex())
  if (urlMatches) {
    from = urlMatches[0]
  }

  if (from.indexOf('://') === -1) {
    from = 'http://' + from
  }

  return from
}
