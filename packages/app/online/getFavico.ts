import assert from 'assert'
import debug from 'debug'
import ICO from 'icojs/index.js' // ensure we get the nodejs version, not the browser one
import isUrl from 'is-url'
import minidom from 'minidom'
import { extname } from 'path'
import url from 'url'
import urlRegex from 'url-regex'
import { AppContext, ImageUri } from '../context'
import { imageSize } from '../util/imageSize'

const log = debug('app:getFavico')

export interface FavicoProps {
  from: string // some sort of identifier to identify where this came from (e.g. url, path)
  source: ImageUri[]
}

const thumbnailSizes = {
  small: 36,
  medium: 56,
  large: 80,
}

const sizes = [32, 64]

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

export const getFavico = async (
  from: string,
  signal: AbortSignal,
  context: AppContext
): Promise<FavicoProps> => {
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
    .map(href => url.resolve(result.url, href))
    .filter(
      (value, index, array): boolean => {
        // return only unique items
        return index === array.indexOf(value)
      }
    )
  log('links: %o', links)

  const images: ImageUri[] = []

  await Promise.all(
    links.map(async link => {
      const response = await fetch(link, { method: 'get', signal })
      if (!response.ok) {
        log('failed getting: %s', link)
        return
      }
      // log('%s => %o', link, response)

      const abuf = await response.arrayBuffer()
      const buf = Buffer.from(abuf)
      // log('%s: %O', link, { hex: buf.toString('hex'), abuf, buf })

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
    })
  )
  // log('%s images: %d %O', from, images.length, [...images])

  return makeFavicoFromImages(from, images, context)
}

const makeFavicoFromImages = async (
  from: string,
  images: ImageUri[],
  context: AppContext
): Promise<FavicoProps> => {
  // log('making favico from %s (%d images %O)', from, images.length, [...images])

  const { resizeImage } = context
  // add resized images (iOS would rather upscale the 16x16 favico than use the better, larger one)
  await Promise.all(
    sizes
      .filter(size => !images.find(image => image.width === size))
      .map(async size => {
        // only resize down; find next larger image
        // log(`gonna resize to ${size}`)
        const src = images.find(image => image.width >= size)
        if (src) {
          // log(`found ${src}`)
          const scale = Math.min(size / src.width!, size / src.height!)
          const width = Math.trunc(src.width! * scale)
          const height = Math.trunc(src.height! * scale)
          assert(width <= size)
          assert(height <= size)
          assert(width === size || height === size)
          const result = await resizeImage(src, width, height, 'PNG')
          // log('resized image: %O', result)
          images.push(result)
        }
      })
  )
  // log('images: %o', images)

  const source = images
    .filter(
      (value, index, array) =>
        index === array.findIndex(a => a.width === value.width && a.height === value.height)
    )
    .sort((a, b) => a.width! - b.width!)
  log('source: %s %o', from, source)

  if (source.length === 0) {
    throw new Error('no images found')
  }

  return { source, from }
}

export const getFavicoFromLibrary = async (context: AppContext) => {
  const { getImageFromLibrary } = context
  const { image, path } = await getImageFromLibrary(128, 128)
  // log('%o', image)
  return makeFavicoFromImages(path, [image], context)
}

const toDataUri = (buf: Buffer, mime: string) => {
  const base64 = buf.toString('base64')
  const uri = `data:${mime};base64,${base64}`
  return uri
}
