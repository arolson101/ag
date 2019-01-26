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
