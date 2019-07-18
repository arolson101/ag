import { ImageUri, imageUriDimensions, isDataUri } from '@ag/util'
import { useEffect, useMemo } from 'react'
import { ImageId, ImageSrc, useAction, useSelector } from '../context'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

export const useImage = (imageId: ImageId | undefined): ImageSrc | undefined => {
  const getImage = useSelector(selectors.getImage)
  const dbLoadImage = useAction(thunks.dbLoadImage)
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
      dbLoadImage({ imageId })
    }
  }, [image])

  if (uriSrc) {
    return uriSrc
  } else {
    return image
  }
}
