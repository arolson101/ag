import { ApolloClient } from 'apollo-client'
import React, { Dispatch } from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { Connection, ConnectionOptions } from 'typeorm'
import { AppAction } from '../actions'
import { AppState, AppStore } from '../reducers'
import { ImageBuf } from '../util'
import { UiContext } from './uiContext'

export const maxImageSize = 512

export interface ClientDependencies {
  ui: UiContext

  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>

  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>

  getImageFromLibrary: () => Promise<ImageBuf | undefined>
  resizeImage: (image: ImageBuf, width: number, height: number) => Promise<ImageBuf>
}

export interface AppContext extends ClientDependencies {
  intl: IntlContext
  client: ApolloClient<any>
  store: AppStore
  dispatch: Dispatch<AppAction>
  getState: () => AppState
}

const defaultContext: AppContext = null as any

export const AppContext = React.createContext<AppContext>(defaultContext)
AppContext.displayName = 'AppContext'
