import { ImageUri, imageUriDimensions, isDataUri } from '@ag/util'
import { useContext, useEffect, useMemo } from 'react'
import { ImageId, ImageSrc, useSelector } from '../context'
import { selectors } from '../reducers'
import { ImageManagerContext } from './ImageManager'

export const useImage = (imageId: ImageId | undefined): ImageSrc | undefined => {
  const imageManager = useContext(ImageManagerContext)
  const getImage = useSelector(selectors.getImage)
  const uriSrc = useMemo(() => {
    if (imageId && isDataUri(imageId)) {
      const src = imageId as ImageUri
      const { width, height } = imageUriDimensions(src)
      return { width, height, src }
    }
  }, [imageId])
  const image = uriSrc || !imageId ? undefined : getImage(imageId)

  useEffect(() => {
    if (imageId && image && !image.src) {
      imageManager.requestImage(imageId)
    }
  }, [image])

  if (uriSrc) {
    return uriSrc
  } else {
    return image
  }
}
