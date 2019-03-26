import { ImageSource } from '@ag/util'
import { createAsyncAction } from 'typesafe-actions'

export const onlineActions = {
  online: {
    getFavico: createAsyncAction(
      'online/getFavico/request',
      'online/getFavico/success',
      'online/getFavico/failure'
    )<string, ImageSource, Error>(),
  },
}
