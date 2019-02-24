import { ClientDependencies } from '@ag/app'
import { imageSize, ImageSource } from '@ag/lib-util'
import crypto from 'crypto'
import debug from 'debug'
import Path from 'path'
import { ImageSourcePropType } from 'react-native'
import RNFS from 'react-native-fs'
import ImageCropPicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'

const log = debug('rn:image')

export interface FavicoProps {
  from: string
  source: ImageSourcePropType
}

export const getImageFromLibrary: ClientDependencies['getImageFromLibrary'] = async (
  width,
  height
) => {
  const image = await ImageCropPicker.openPicker({
    cropping: true,
    width,
    height,
    forceJpg: true,
    multiple: false,
  })
  log('%o', image)
  if (Array.isArray(image)) {
    throw new Error('only one image can be picked!')
  }
  const { path, mime } = image
  try {
    const base64 = await RNFS.readFile(path, 'base64')
    const buf = Buffer.from(base64, 'base64')
    const size = imageSize(buf, path)
    const newImage = { width: size.width, height: size.height, mime, buf }
    return newImage
  } finally {
    await ImageCropPicker.clean()
  }
}

const tempName = (ext: string) => {
  return crypto.randomBytes(8).toString('base64') + '.' + ext
}

export const openCropper: ClientDependencies['openCropper'] = async image => {
  const ext = image.mime.replace('image/', '')
  const path = Path.join(RNFS.TemporaryDirectoryPath, tempName(ext))
  log('openCropper path: %s', path)
  try {
    await RNFS.writeFile(path, image.buf.toString('base64'), 'base64')
    const result = await ImageCropPicker.openCropper({
      path,
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
      includeExif: false,
    })
    log('openCropper result: %o', result)
    if (result) {
      const { width, height, mime, data } = result
      if (!data) {
        throw new Error('image data was not present')
      }
      const buf = Buffer.from(data, 'base64')
      return { width, height, mime, buf }
    }
  } catch (error) {
    log('openCropper error %o', error)
  } finally {
    await RNFS.unlink(path)
    await ImageCropPicker.clean()
  }
}

export const scaleImage: ClientDependencies['scaleImage'] = async (image, scale) => {
  const source = ImageSource.fromImageBuf(image)
  const width = scale * source.width
  const height = scale * source.height
  const result = await ImageResizer.createResizedImage(source.uri, width, width, 'PNG', 100)
  try {
    const base64 = await RNFS.readFile(result.uri, 'base64')
    const buf = Buffer.from(base64, 'base64')
    const mime = 'image/png'
    return { width, height, mime, buf }
  } finally {
    await RNFS.unlink(result.uri)
  }
}
