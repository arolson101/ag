import { ApolloClient } from 'apollo-client'
import React, { Dispatch } from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { Connection, ConnectionOptions } from 'typeorm'
import { AppAction } from '../actions'
import { AppState } from '../reducers'
import { UiContext } from './uiContext'

export interface AppContext {
  intl: IntlContext
  ui: UiContext
  client: ApolloClient<any>
  dispatch: Dispatch<AppAction>
  getState: () => AppState

  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>
}

const defaultContext: AppContext = null as any

export const AppContext = React.createContext<AppContext>(defaultContext)
AppContext.displayName = 'AppContext'
