import { AppContext } from '@ag/app'
import { imageSize, toImageString } from '@ag/app/util'
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

export const resizeImage: AppContext['resizeImage'] = async (image, width, height) => {
  const uri = toImageString(image)
  const result = await ImageResizer.createResizedImage(uri, width, height, 'PNG', 100)
  try {
    const base64 = await RNFS.readFile(result.uri, 'base64')
    const buf = Buffer.from(base64, 'base64')
    const mime = 'image/png'
    return { width, height, mime, buf }
  } finally {
    await RNFS.unlink(result.uri)
  }
}

export const getImageFromLibrary: AppContext['getImageFromLibrary'] = async () => {
  const image = await ImageCropPicker.openPicker({ forceJpg: true, multiple: false })
  log('%o', image)
  if (Array.isArray(image)) {
    throw new Error('only one image can be picked!')
  }
  const { path, mime } = image
  try {
    const base64 = await RNFS.readFile(path, 'base64')
    const buf = Buffer.from(base64, 'base64')
    const { width, height } = imageSize(buf, path)
    const newImage = { width, height, mime, buf }
    return newImage
  } finally {
    ImageCropPicker.clean()
  }
}
