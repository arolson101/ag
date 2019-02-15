import debug from 'debug'
import { Column } from 'typeorm'
import { CompressedJson, dehydrate, hydrate } from './dehydrate'

const log = debug('app:ImageSource')

export interface ImageBuf {
  width: number
  height: number
  mime: string
  buf: Buffer
}

export class ImageSource {
  @Column() width: number
  @Column() height: number
  @Column() uri: string

  constructor(props?: { width: number; height: number; uri: string }) {
    this.width = props ? props.width : 0
    this.height = props ? props.height : 0
    this.uri = props ? props.uri : ''
    // log('ImageSource constructor %o', this)
  }

  encodeString(): string {
    return dehydrate({ width: this.width, height: this.height, uri: this.uri })
  }

  static fromString(data: CompressedJson<ImageSource> | string): ImageSource {
    if (data) {
      const props = hydrate(data as CompressedJson<ImageSource>)
      return new ImageSource(props)
    } else {
      return new ImageSource()
    }
  }

  static fromImageBuf(data: ImageBuf | undefined): ImageSource {
    if (data) {
      const { buf, mime, width, height } = data
      const base64 = buf.toString('base64')
      const uri = `data:${mime};base64,${base64}`
      return new ImageSource({ width, height, uri })
    } else {
      return new ImageSource()
    }
  }
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
  png: require('image-size/lib/types/png'),
  // ico: require('image-size/lib/types/ico'),
  jpg: require('image-size/lib/types/jpg'),
  gif: require('image-size/lib/types/gif'),
  icns: require('image-size/lib/types/icns'),
  bmp: require('image-size/lib/types/bmp'),
  svg: require('image-size/lib/types/svg'),
  // cur: require('image-size/lib/types/cur'),
  // dds: require('image-size/lib/types/dds'),
  // psd: require('image-size/lib/types/psd'),
  // tiff: require('image-size/lib/types/tiff'),
  webp: require('image-size/lib/types/webp'),
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
  throw new TypeError('unsupported file type: ' + type + ' (file: ' + filepath + ')')
}
