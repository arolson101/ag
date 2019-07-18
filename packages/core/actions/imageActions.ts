import { Image } from '@ag/db'
import { createStandardAction } from 'typesafe-actions'

export const imageActions = {
  imageLoaded: createStandardAction('core/imageLoaded')<{ image: Image }>(),
}
