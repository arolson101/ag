import { SystemCallbacks } from '@ag/core/context'
import electron, { nativeImage } from 'electron'

const dialog = (electron.remote || electron).dialog

export const getImageFromLibrary: SystemCallbacks['getImageFromLibrary'] = async (
  width,
  height
) => {
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

export const openCropper: SystemCallbacks['openCropper'] = async image => {
  return undefined
}

export const scaleImage: SystemCallbacks['scaleImage'] = async (image, scale) => {
  const width = image.width * scale
  const height = image.height * scale
  const img = nativeImage.createFromBuffer(image.buf, { height: image.height, width: image.width })
  const resized = img.resize({ width, height })
  const buf = img.toPNG()
  const mime = 'image/png'
  return { ...resized.getSize(), mime, buf }
}
