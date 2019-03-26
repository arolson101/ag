import { ImageBuf } from '@ag/util'
import Axios from 'axios'
import React, { Dispatch } from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { CoreAction } from '../actions'
import { CoreState, CoreStore } from '../reducers'
import { UiContext } from './uiContext'

export const maxImageSize = 512

export interface ClientDependencies {
  axios: typeof Axios
  ui: UiContext

  getImageFromLibrary: (width: number, height: number) => Promise<ImageBuf | undefined>
  openCropper: (image: ImageBuf) => Promise<ImageBuf | undefined>
  scaleImage: (image: ImageBuf, scale: number) => Promise<ImageBuf>
}

export interface CoreContext extends ClientDependencies {
  intl: IntlContext
  store: CoreStore
  dispatch: Dispatch<CoreAction>
  getState: () => CoreState
  uniqueId: () => string
}

const defaultContext: CoreContext = null as any

export const CoreContext = React.createContext<CoreContext>(defaultContext)
CoreContext.displayName = 'AppContext'
