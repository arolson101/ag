import debug from 'debug'
import { DataUri, decodeDataUri, encodeDataURI, getDataURIAttribs } from './datauri'

const log = debug('util:ImageSource')

export type ImageUri = DataUri<{ width: string; height: string }> | ''

const size0x0 = { width: 0, height: 0 }

export interface ImageBuf {
  width: number
  height: number
  mime: string
  buf: Buffer
}

const attribsFromDimensions = ({ width, height }: { width: number; height: number }) => ({
  width: width.toString(),
  height: height.toString(),
})

export const imageBufToUri = (buf: ImageBuf | undefined): ImageUri => {
  return buf ? encodeDataURI(buf.mime, buf.buf, attribsFromDimensions(buf)) : ''
}

const dimensionsFromAttribs = ({ width, height }: { width: string; height: string }) => ({
  width: parseFloat(width),
  height: parseFloat(height),
})

export const imageUriDimensions = (uri: ImageUri) => {
  return uri ? dimensionsFromAttribs(getDataURIAttribs(uri)) : size0x0
}

export const toImageURISource = (uri: ImageUri) => {
  const { width, height } = imageUriDimensions(uri)
  return { width, height, uri }
}

export const imageUriToBuf = (uri: ImageUri): ImageBuf => {
  if (!uri) {
    throw new Error('empty URI')
  }
  const { buf, attrs, mime } = decodeDataUri(uri)
  return { ...(attrs ? dimensionsFromAttribs(attrs) : size0x0), mime, buf }
}

interface ImageSize {
  width: number
  height: number
  type: string
}

interface TypeHandler {
  detect: (buffer: Buffer, filepath: string) => boolean
  calculate: (buffer: Buffer, filepath: string) => ImageSize | false
}

interface TypeHandlerMap {
  [ext: string]: TypeHandler
}

const typeHandlers: TypeHandlerMap = {
  'image/png': require('image-size/lib/types/png'),
  // ico: require('image-size/lib/types/ico'),
  'image/jpeg': require('image-size/lib/types/jpg'),
  'image/gif': require('image-size/lib/types/gif'),
  icns: require('image-size/lib/types/icns'),
  'image/bmp': require('image-size/lib/types/bmp'),
  'image/svg+xml': require('image-size/lib/types/svg'),
  // cur: require('image-size/lib/types/cur'),
  // dds: require('image-size/lib/types/dds'),
  // psd: require('image-size/lib/types/psd'),
  // tiff: require('image-size/lib/types/tiff'),
  'image/webp': require('image-size/lib/types/webp'),
}

const detector = (buffer: Buffer, filepath: string) => {
  for (const type of Object.keys(typeHandlers)) {
    const result = typeHandlers[type].detect(buffer, filepath)
    if (result) {
      return type
    }
  }
  return undefined
}

export function imageSize(buffer: Buffer, filepath: string) {
  // detect the file type.. don't rely on the extension
  const type = detector(buffer, filepath)!

  // find an appropriate handler for this file type
  if (type in typeHandlers) {
    const size = typeHandlers[type].calculate(buffer, filepath)
    if (size !== false) {
      size.type = type
      return size
    }
  }

  // throw up, if we don't understand the file
  throw new Error('unsupported file type: ' + filepath)
}
