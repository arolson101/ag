import { ClientDependencies } from '@ag/app'
import electron, { nativeImage } from 'electron'

const dialog = (electron.remote || electron).dialog

export const resizeImage: ClientDependencies['resizeImage'] = async (image, width, height) => {
  const img = nativeImage.createFromBuffer(image.buf, { height: image.height, width: image.width })
  const resized = img.resize({ width, height })
  const buf = img.toPNG()
  const mime = 'image/png'
  return { ...resized.getSize(), mime, buf }
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
    const buf = img.toPNG()
    const mime = 'image/png'
    return { ...img.getSize(), mime, buf }
  }
}
