import { fixUrl, ImageBuf, isUrl } from '@ag/util'
import Axios, { CancelToken } from 'axios'
import debug from 'debug'
import minidom from 'minidom'
import url from 'url'
import { getFinalUrl, getImage } from './getImages'

const log = debug('online:getFavico')

export const getFavico = async (
  from: string,
  cancelToken: CancelToken
): Promise<ImageBuf | undefined> => {
  from = fixUrl(from)

  if (!isUrl(from)) {
    log(`${from} is not an URL`)
    throw new Error(`${from} is not an URL`)
  }

  const result = await Axios.get(from, { cancelToken, responseType: 'text' })
  log('axios %s %o', from, result)

  const finalUrl = getFinalUrl(from, result)

  const body = result.data
  // log('body %O', { body })

  const doc = minidom(body)
  // log('doc %o', doc)

  const links = ([] as string[])
    .concat(
      // <link rel='shortcut icon|icon|apple-touch-icon' href='...'>
      Array.from(doc.getElementsByTagName('link'))
        .filter(link => {
          switch (link.getAttribute('rel')) {
            case 'shortcut icon':
            case 'icon':
            case 'apple-touch-icon':
              return true
            default:
              return false
          }
        })
        .map(link => link.getAttribute('href'))
        .filter((href): href is string => !!href)
    )
    // .concat(
    //   // <img src='...'>
    //   Array.from(doc.getElementsByTagName('img'))
    //     .map(img => img.getAttribute('src') /*|| img.getAttribute('data-src')*/)
    //     .filter((href): href is string => !!href)
    // )
    .concat(
      // http://ogp.me/
      // <meta property='og:image' content='...'>
      Array.from(doc.getElementsByTagName('meta'))
        .filter(meta => meta.getAttribute('property') === 'og:image')
        .map(meta => meta.getAttribute('content'))
        .filter((href): href is string => !!href)
    )
    .concat('/favicon.ico')
    .map(href => url.resolve(finalUrl, href))
    .filter(
      (value, index, array): boolean => {
        // return only unique items
        return index === array.indexOf(value)
      }
    )
  log('links: %o', links)

  const images: ImageBuf[] = []

  await Promise.all(
    links.map(async link => {
      const dl = await getImage(link, cancelToken)
      if (!dl) {
        log('failed getting: %s', link)
      } else {
        images.push(dl)
      }
    })
  )
  // log('%s images: %d %O', from, images.length, [...images])

  // sort by descending size
  images.sort((a, b) => b.width - a.width)
  return images[0]
}
