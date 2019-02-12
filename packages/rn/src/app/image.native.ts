import { AppContext, maxImageSize } from '@ag/app'
import { imageSize } from '@ag/app/util'
import debug from 'debug'
import { ImageSourcePropType } from 'react-native'
import RNFS from 'react-native-fs'
import ImageCropPicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'

const log = debug('rn:image')

export interface FavicoProps {
  from: string
  source: ImageSourcePropType
}

export const resizeImage: AppContext['resizeImage'] = async (image, width, height, format) => {
  const result = await ImageResizer.createResizedImage(image.uri, width, height, 'PNG', 100)
  try {
    const base64 = await RNFS.readFile(result.uri, 'base64')
    const mime = 'image/png'
    const uri = `data:${mime};base64,${base64}`
    return { width, height, uri }
  } finally {
    await RNFS.unlink(result.uri)
  }
}

export const getImageFromLibrary: AppContext['getImageFromLibrary'] = async () => {
  const image = await ImageCropPicker.openPicker({ forceJpg: true })
  log('%o', image)
  if (Array.isArray(image)) {
    throw new Error('only one image can be picked!')
  }
  const { path, mime } = image
  try {
    const base64 = await RNFS.readFile(path, 'base64')
    const buf = Buffer.from(base64, 'base64')
    const { width, height } = imageSize(buf, path)
    const aspect = width / height
    let [newWidth, newHeight, resize] = [width, height, true]
    if (newWidth > maxImageSize) {
      newWidth = maxImageSize
      newHeight = newWidth / aspect
      resize = true
    }
    if (newHeight > maxImageSize) {
      newHeight = maxImageSize
      newWidth = newHeight * aspect
      resize = true
    }
    const uri = `data:${mime};base64,${base64}`
    const newImage = { width, height, uri }
    if (resize) {
      return resizeImage(newImage, newWidth, newHeight, 'PNG')
    } else {
      return newImage
    }
  } finally {
    ImageCropPicker.clean()
  }
}
