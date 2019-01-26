import assert from 'assert'
import debug from 'debug'
import ICO from 'icojs'
import isUrl from 'is-url'
import minidom from 'minidom'
import { extname } from 'path'
import url from 'url'
import { AppContext, CancelToken, ImageUri } from '../context'
import { imageSize } from '../util/imageSize'

const log = debug('getFavico')

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

export const getFavico = async (
  from: string,
  cancelToken: CancelToken,
  context: AppContext
): Promise<FavicoProps> => {
  if (!isUrl(from)) {
    throw new Error(`${from} is not an URL`)
  }

  const { httpRequest } = context
  const urlobj = url.parse(from)
  urlobj.protocol = urlobj.protocol || 'http'

  const result = await httpRequest({ url: url.format(urlobj), method: 'get', cancelToken })
  // log('%o', { result })
  if (!result.ok) {
    throw new Error(result.statusText)
  }

  const body = await result.text()
  const doc = minidom(body)

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
    .map(href => url.resolve(result.url, href))
    .filter(
      (value, index, array): boolean => {
        // return only unique items
        return index === array.indexOf(value)
      }
    )
  // log('%o', { links })

  const images: ImageUri[] = []

  await Promise.all(
    links.map(async link => {
      const response = await httpRequest({ url: link, method: 'get', cancelToken })
      if (!response.ok) {
        return
      }
      const blob = await response.blob()
      const buf = await toBuffer(blob)
      if (ICO.isICO(buf.buffer as ArrayBuffer)) {
        const mime = 'image/png'
        const parsedImages = await ICO.parse(buf.buffer as ArrayBuffer, mime)
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

  return makeFavicoFromImages(from, images, context)
}

const makeFavicoFromImages = async (
  from: string,
  images: ImageUri[],
  context: AppContext
): Promise<FavicoProps> => {
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
          images.push(result)
        }
      })
  )
  log('%o', { images })

  const source = images
    .filter(
      (value, index, array) =>
        index === array.findIndex(a => a.width === value.width && a.height === value.height)
    )
    .sort((a, b) => a.width! - b.width!)
  log('%o', { source })

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
  const base64 = Buffer.from(buf).toString('base64')
  const uri = `data:${mime};base64,${base64}`
  return uri
}

const toBuffer = (blob: Blob) => {
  return new Promise<Buffer>((resolve, reject) => {
    const fr = new FileReader()

    const loadend = (e: any) => {
      fr.removeEventListener('loadend', loadend, false)
      if (e.error) {
        reject(e.error)
      } else {
        const dataUrl = fr.result as string
        const marker = 'base64,'
        const idx = dataUrl.indexOf(marker)
        if (idx) {
          const buf = Buffer.from(dataUrl.substr(idx + marker.length), 'base64')
          resolve(buf)
        } else {
          reject(new Error(`'${marker}' not found in string`))
        }
      }
    }

    fr.addEventListener('loadend', loadend, false)
    fr.readAsDataURL(blob)
  })
}
