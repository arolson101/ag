import debug from 'debug'
import ICO from 'icojs/index.js' // ensure we get the nodejs version, not the browser one
import isUrl from 'is-url'
import minidom from 'minidom'
import { extname } from 'path'
import url from 'url'
import { AppContext, ImageUri } from '../context'
import { imageSize } from '../util/imageSize'
import { fixUrl } from '../util/url'

const log = debug('app:getImages')

export const getImageList = async (from: string, signal: AbortSignal, context: AppContext) => {
  from = fixUrl(from)

  if (!isUrl(from)) {
    log(`${from} is not an URL`)
    throw new Error(`${from} is not an URL`)
  }

  const { fetch } = context

  const result = await fetch(from, { method: 'get', signal })
  // log('fetch %s %o', from, result)
  if (!result.ok) {
    log(result.statusText)
    throw new Error(result.statusText)
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

  const images: ImageUri[] = []

  if (ICO.isICO(buf)) {
    const mime = 'image/png'
    const parsedImages = await ICO.parse(buf, mime)
    for (const parsedImage of parsedImages) {
      const { width, height } = parsedImage
      const uri = toDataUri(Buffer.from(parsedImage.buffer), mime)
      images.push({ width, height, uri })
    }
  } else {
    const ext = extname(link).substr(1)
    const { width, height } = imageSize(buf, link)
    const mime = response.headers.get('content-type') || `image/${ext}`
    const uri = toDataUri(buf, mime)
    images.push({ width, height, uri })
  }

  return images
}

const toDataUri = (buf: Buffer, mime: string) => {
  const base64 = buf.toString('base64')
  const uri = `data:${mime};base64,${base64}`
  return uri
}
