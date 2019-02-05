import { ClientDependencies } from '@ag/app'
import { nativeImage } from 'electron'

export const resizeImage: ClientDependencies['resizeImage'] = async (
  image,
  width,
  height,
  format
) => {
  const img = nativeImage.createFromDataURL(image.uri)
  const resized = img.resize({ width, height })
  const uri = resized.toDataURL()
  return { ...resized.getSize(), uri }
}
