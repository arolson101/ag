import { Online } from '@ag/online'
import { ImageBuf } from '@ag/util'
import React, { useContext } from 'react'
import { InjectedIntl as IntlContext1 } from 'react-intl'
import { ActionCreator, bindActionCreators } from 'redux'
import { CoreStore } from '../reducers'
import { UiContext } from './uiContext'

export const maxImageSize = 512

export interface SystemCallbacks {
  getImageFromLibrary: (width: number, height: number) => Promise<ImageBuf | undefined>
  openCropper: (image: ImageBuf) => Promise<ImageBuf | undefined>
  scaleImage: (image: ImageBuf, scale: number) => Promise<ImageBuf>
}

export type IntlContext = IntlContext1
export const IntlContext = React.createContext<IntlContext1>(null as any)
IntlContext.displayName = 'IntlContext'

export const CoreStoreContext = React.createContext<CoreStore>(null as any)
CoreStoreContext.displayName = 'CoreStoreContext'

export const OnlineContext = React.createContext<Online>(null as any)
OnlineContext.displayName = 'OnlineContext'

export const SystemContext = React.createContext<SystemCallbacks>(null as any)
SystemContext.displayName = 'SystemContext'

export const useIntl = () => {
  return useContext(IntlContext)
}

export const useCoreStore = () => useContext(CoreStoreContext)

export const useAction = <A, C extends ActionCreator<A>>(actionCreator: C) => {
  const store = useContext(CoreStoreContext)
  return bindActionCreators(actionCreator, store.dispatch)
}

export const useOnline = () => useContext(OnlineContext)

export const useUi = () => useContext(UiContext)

export const useSystem = () => useContext(SystemContext)
