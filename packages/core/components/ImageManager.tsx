import debug from 'debug'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useDispatch } from '../context'
import { thunks } from '../thunks'

const log = debug('core:ImageManager')

export interface ImageManager {
  requestImage: (imageId: string) => any
}

const initialValue: ImageManager = {
  requestImage: (imageId: string) => log('requestImage %s', imageId),
}

export const ImageManagerContext = React.createContext<ImageManager>(initialValue)

interface Props {}

export const ImageManager = Object.assign(
  React.memo<Props>(function _ImageManager({ children }) {
    const dispatch = useDispatch()
    const imageRequests = useRef<Record<string, boolean>>({})
    const requestImage = useCallback(
      async function _requestImage(imageId: string) {
        if (!imageRequests.current[imageId]) {
          imageRequests.current[imageId] = true
          await dispatch(thunks.dbLoadImage({ imageId }))
          delete imageRequests.current[imageId]
        }
      },
      [imageRequests]
    )
    const value = useMemo(() => ({ requestImage }), [imageRequests])
    return <ImageManagerContext.Provider value={value}>{children}</ImageManagerContext.Provider>
  }),
  {
    displayName: 'ImageManager',
  }
)
