import { AppContext, ImageUri } from '@ag/app'
import { ImageSourcePropType, ImageURISource } from 'react-native'
import RNFS from 'react-native-fs'
import ImageCropPicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'

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

// export const getFavicoFromLibrary = async () => {
//   const image = await ImageCropPicker.openPicker({
//     width: 128,
//     height: 128,
//     cropping: true,
//   })
//   // log('%o', image)
//   if (Array.isArray(image)) {
//     throw new Error('only one image can be picked!')
//   }
//   const { width, height, path, mime } = image
//   try {
//     const base64 = await RNFS.readFile(path, 'base64')
//     const uri = `data:${mime};base64,${base64}`
//     return makeFavicoFromImages(path, [{ width, height, uri }])
//   } finally {
//     await RNFS.unlink(path)
//   }
// }
