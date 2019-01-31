import { ApolloClient } from 'apollo-client'
import { CancelToken, CancelTokenSource } from 'axios'
import React, { Dispatch } from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { Connection, ConnectionOptions } from 'typeorm'
import { AppAction } from '../actions'
import { AppState, AppStore } from '../reducers'
import { UiContext } from './uiContext'

export { CancelToken, CancelTokenSource }

export interface ImageUri {
  width: number
  height: number
  uri: string
}

export interface LibraryImage {
  image: ImageUri
  path: string
}

export interface ClientDependencies {
  ui: UiContext

  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>

  httpRequest: (
    params: {
      url: string
      method: string
      headers?: Record<string, string>
      data?: string
      cancelToken?: CancelToken
    }
  ) => Promise<any>

  getImageFromLibrary: (width: number, height: number) => Promise<LibraryImage>
  resizeImage: (image: ImageUri, width: number, height: number, format: string) => Promise<ImageUri>
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
