import { ImageBuf } from '@ag/util'
import React, { Dispatch } from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { AppAction } from '../actions'
import { AppState, AppStore } from '../reducers'
import { UiContext } from './uiContext'

export const maxImageSize = 512

export interface ClientDependencies {
  ui: UiContext

  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>

  getImageFromLibrary: (width: number, height: number) => Promise<ImageBuf | undefined>
  openCropper: (image: ImageBuf) => Promise<ImageBuf | undefined>
  scaleImage: (image: ImageBuf, scale: number) => Promise<ImageBuf>
}

export interface AppContext extends ClientDependencies {
  intl: IntlContext
  store: AppStore
  dispatch: Dispatch<AppAction>
  getState: () => AppState
}

const defaultContext: AppContext = null as any

export const AppContext = React.createContext<AppContext>(defaultContext)
AppContext.displayName = 'AppContext'
