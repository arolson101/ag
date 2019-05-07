import { Online } from '@ag/online'
import { ImageBuf } from '@ag/util'
import React, { Dispatch, useContext } from 'react'
import { InjectedIntl as IntlContext1 } from 'react-intl'
import { ActionCreator, bindActionCreators } from 'redux'
import { CoreState, CoreStore } from '../reducers'
import { UiContext } from './uiContext'

export const maxImageSize = 512

export interface ClientDependencies {
  online: Online
  ui: UiContext

  getImageFromLibrary: (width: number, height: number) => Promise<ImageBuf | undefined>
  openCropper: (image: ImageBuf) => Promise<ImageBuf | undefined>
  scaleImage: (image: ImageBuf, scale: number) => Promise<ImageBuf>
}

export interface CoreContext extends ClientDependencies {
  store: CoreStore
  uniqueId: () => string
}

export const CoreContext = React.createContext<CoreContext>(null as any)
CoreContext.displayName = 'AppContext'

export type IntlContext = IntlContext1
export const IntlContext = React.createContext<IntlContext1>(null as any)
IntlContext.displayName = 'IntlContext'

export const useIntl = () => {
  return useContext(IntlContext)
}

export const useCoreStore = () => {
  const { store } = useContext(CoreContext)
  return store
}

export const useAction = <A, C extends ActionCreator<A>>(actionCreator: C) => {
  const { store } = useContext(CoreContext)
  return bindActionCreators(actionCreator, store.dispatch)
}
