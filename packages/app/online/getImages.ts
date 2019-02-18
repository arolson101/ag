import debug from 'debug'
import ICO from 'icojs/index.js' // ensure we get the nodejs version, not the browser one
import isUrl from 'is-url'
import minidom from 'minidom'
import { extname } from 'path'
import url from 'url'
import { AppContext } from '../context'
import { fixUrl, ImageBuf, imageSize } from '../util'

const log = debug('app:getImages')

export const getImageList = async (from: string, signal: AbortSignal, context: AppContext) => {
  from = fixUrl(from)

  if (!isUrl(from)) {
    log(`${from} is not an URL`)
    throw new Error(`${from} is not an URL`)
  }

  const { fetch } = context

  const result = await fetch(from, { method: 'get', signal })
  log('fetch %s %o', from, result)
  if (!result.ok) {
    log(result.statusText)
    throw new Error(result.statusText)
  }

  const contentType = result.headers.get('Content-Type')
  if (contentType && contentType.startsWith('image/')) {
    return [from]
  }

  const body = await result.text()
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
    .concat(
      // <img src='...'>
      Array.from(doc.getElementsByTagName('img'))
        .map(img => img.getAttribute('src') /*|| img.getAttribute('data-src')*/)
        .filter((href): href is string => !!href)
    )
    .concat(
      // http://ogp.me/
      // <meta property='og:image' content='...'>
      Array.from(doc.getElementsByTagName('meta'))
        .filter(meta => meta.getAttribute('property') === 'og:image')
        .map(meta => meta.getAttribute('content'))
        .filter((href): href is string => !!href)
    )
    .concat('/favicon.ico')
    .map(href => url.resolve(result.url, href))
    .filter(
      (value, index, array): boolean => {
        // return only unique items
        return index === array.indexOf(value)
      }
    )
  log('links: %o', links)

  return links
}

export const getImage = async (link: string, signal: AbortSignal, context: AppContext) => {
  try {
    const { fetch } = context

    const response = await fetch(link, { method: 'get', signal })
    if (!response.ok) {
      log('failed getting: %s', link)
      return
    }
    // log('%s => %o', link, response)

    const abuf = await response.arrayBuffer()
    const buf = Buffer.from(abuf)
    // log('%s: %O', link, { hex: buf.toString('hex'), abuf, buf })
    let image: ImageBuf

    if (ICO.isICO(buf)) {
      const mime = 'image/png'
      const parsedImages = await ICO.parse(buf, mime)
      const images: ImageBuf[] = parsedImages
        .map(({ width, height, buffer }) => {
          return { width, height, mime, buf: Buffer.from(buffer) }
        })
        .sort((a, b) => b.width - a.width) // sort by descending size
      image = images[0]
    } else {
      const ext = extname(link).substr(1)
      const { width, height } = imageSize(buf, link)
      const mime = response.headers.get('content-type') || `image/${ext}`
      image = { width, height, mime, buf }
    }

    log('getImage %s => %o', link, image)
    return image
  } catch (error) {
    log('error %o', error)
    throw error
  }
}
