import { Online } from '@ag/online'
import { ImageBuf } from '@ag/util'
import React, { Dispatch, useContext, useMemo } from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { useDispatch as useDispatch1, useSelector as useSelector1 } from 'react-redux'
import { ActionCreator, bindActionCreators } from 'redux'
import { Connection, ConnectionOptions } from 'typeorm'
import { CoreAction } from '../actions'
import { CoreState, selectors } from '../reducers'
import { UiContext } from './uiContext'

export const maxImageSize = 512

export interface SystemCallbacks {
  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>

  getImageFromLibrary: (width: number, height: number) => Promise<ImageBuf | undefined>
  openCropper: (image: ImageBuf) => Promise<ImageBuf | undefined>
  scaleImage: (image: ImageBuf, scale: number) => Promise<ImageBuf>
}

export { IntlContext }

export const OnlineContext = React.createContext<Online>(null as any)
OnlineContext.displayName = 'OnlineContext'

export const SystemContext = React.createContext<SystemCallbacks>(null as any)
SystemContext.displayName = 'SystemContext'

export const useDispatch: () => Dispatch<CoreAction> = useDispatch1
export const useSelector: <TSelected>(
  selector: (state: CoreState) => TSelected,
  deps?: ReadonlyArray<any>
) => TSelected = useSelector1

export const useIntl = (): IntlContext => {
  return useSelector(selectors.getIntl)
}

export const useAction = <A, C extends ActionCreator<A>>(actionCreator: C) => {
  // https://react-redux.js.org/next/api/hooks#removed-useactions
  const dispatch = useDispatch1()
  return useMemo(() => {
    return bindActionCreators(actionCreator, dispatch)
  }, [actionCreator, dispatch])
}

export const useOnline = () => useContext(OnlineContext)

export const useUi = () => useContext(UiContext)

export const useSystem = () => useContext(SystemContext)
