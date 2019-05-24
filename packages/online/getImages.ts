import { DataURI, decodeDataURI, fixUrl, ImageBuf, imageSize, isDataURI } from '@ag/util'
import Axios, { AxiosResponse, CancelToken } from 'axios'
import debug from 'debug'
import ICO from 'icojs/index.js' // ensure we get the nodejs version, not the browser one
import isUrl from 'is-url'
import minidom from 'minidom'
import { extname } from 'path'
import url from 'url'

const log = debug('online:getImages')

export const getFinalUrl = (requestedUrl: string, response: AxiosResponse<any>): string => {
  if (response.request instanceof XMLHttpRequest) {
    return response.request.responseURL
  } else {
    log('not an XMLHttpRequest: %o', response.request)
    return requestedUrl
  }
}

export const getImageList = async (from: string, cancelToken: CancelToken) => {
  from = fixUrl(from)

  if (!isUrl(from)) {
    log(`${from} is not an URL`)
    throw new Error(`${from} is not an URL`)
  }

  const result = await Axios.get<string>(from, { cancelToken, responseType: 'text' })
  // const result = await fetch(from, { method: 'get', signal })
  // log('axios %s %o', from, result)

  const finalUrl = getFinalUrl(from, result)

  const contentType = result.headers['content-type']
  if (contentType && contentType.startsWith('image/')) {
    return [from]
  }

  const body = result.data
  // const body = await result.text()
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
    .map(href => url.resolve(finalUrl, href))
    .filter(
      (value, index, array): boolean => {
        // return only unique items
        return index === array.indexOf(value)
      }
    )
  // log('links: %o', links)

  return links
}

export const getImage = async (link: string, cancelToken: CancelToken) => {
  try {
    let buf: Buffer
    let mime: string

    if (isDataURI(link)) {
      const data = decodeDataURI(link as DataURI)
      buf = data.buf
      mime = data.mime
    } else {
      const response = await Axios.get<ArrayBuffer>(link, {
        cancelToken,
        responseType: 'arraybuffer',
      })
      // log('%s => %o', link, response)

      if (response.data.byteLength === 0) {
        throw new Error(`empty data returned from ${link}`)
      }

      const ext = extname(link).substr(1)
      buf = Buffer.from(response.data)
      mime = response.headers['content-type'] || `image/${ext}`
    }

    let image: ImageBuf

    if (ICO.isICO(buf)) {
      mime = 'image/png'
      const parsedImages = await ICO.parse(buf, mime)
      const images: ImageBuf[] = parsedImages
        .map(({ width, height, buffer }) => {
          return { width, height, mime, buf: Buffer.from(buffer) }
        })
        .sort((a, b) => b.width - a.width) // sort by descending size
      image = images[0]
    } else {
      const { width, height, type } = imageSize(buf, link)
      image = { width, height, mime: type, buf }
    }

    // log('getImage %s => %o', link, image)
    return image
  } catch (error) {
    log('error %o', error)
    throw error
  }
}
