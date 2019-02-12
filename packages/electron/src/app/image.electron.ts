import { ClientDependencies } from '@ag/app'
import electron, { nativeImage } from 'electron'

const dialog = (electron.remote || electron).dialog

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

export const getImageFromLibrary: ClientDependencies['getImageFromLibrary'] = async () => {
  const res = dialog.showOpenDialog({
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  })
  if (res && res.length === 1) {
    const path = res[0]
    const img = nativeImage.createFromPath(path)
    const uri = img.toDataURL()
    return { ...img.getSize(), uri }
  }
}
