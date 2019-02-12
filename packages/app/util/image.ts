import { CompressedJson, dehydrate, hydrate } from './dehydrate'

export interface ImageBuf {
  width: number
  height: number
  mime: string
  buf: Buffer
}

export interface ImageSource {
  width: number
  height: number
  uri: string
}

export type ImageString = CompressedJson<ImageSource>

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
  // webp: require('image-size/lib/types/webp'),
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

export const toImageString = (image: ImageBuf | undefined): ImageString => {
  if (image) {
    const { buf, mime, width, height } = image
    const base64 = buf.toString('base64')
    const uri = `data:${mime};base64,${base64}`
    const data: ImageSource = { width, height, uri }
    return dehydrate(data)
  } else {
    return '' as ImageString
  }
}

export const toImageSource = (imageString: ImageString | string): ImageSource | undefined => {
  if (imageString) {
    return hydrate(imageString as ImageString)
  } else {
    return undefined
  }
}

// export const pickBestImageUri = (source: ImageUri[], size?: number) => {
//   if (!source.length) {
//     return
//   }
//   if (!size) {
//     size = Math.max(...source.map(x => x.width))
//     // log('pickBestImageUri- no size, using max of %d %o', size, source)
//   }
//   const best = source.find(img => img.width >= size!) || source[source.length - 1]
//   // log('pickBestImageUri- best is %dx%d, %o', best.width, best.height, source)

//   let { width, height } = best
//   if (size) {
//     const ratio = width / height
//     if (width > size) {
//       width = size
//       height = size / ratio
//     }
//     if (height > size) {
//       width = size * ratio
//       height = size
//     }
//   }
//   return { width, height, src: best.uri }
// }
