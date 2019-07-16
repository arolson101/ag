import { createStandardAction } from 'typesafe-actions'

export const imageActions = {
  loadImage: createStandardAction('core/loadImage')<{ imageId: string }>(),
}
