import { Online } from '@ag/online'
import { ImageBuf } from '@ag/util'
import React, { Dispatch, useContext, useMemo } from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { useDispatch as useDispatch1, useSelector } from 'react-redux'
import { ActionCreator, bindActionCreators } from 'redux'
import { Connection, ConnectionOptions } from 'typeorm'
import { CoreAction } from '../actions'
import { selectors } from '../reducers'
import { UiContext } from './uiContext'

export { IntlContext, useSelector }

export const maxImageSize = 512

export type CoreDispatch = Dispatch<CoreAction>

export interface CoreDependencies {
  online: Online
  ui: UiContext
  sys: SystemCallbacks
}

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

export const CoreContext = React.createContext<CoreDependencies>(null as any)
CoreContext.displayName = 'CoreContext'

export const useDispatch: () => CoreDispatch = useDispatch1

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

export const useOnline = () => useContext(CoreContext).online

export const useUi = () => useContext(CoreContext).ui

export const useSystem = () => useContext(CoreContext).sys
