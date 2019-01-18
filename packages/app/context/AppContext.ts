import { ApolloClient } from 'apollo-client'
import React, { Dispatch } from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { AppAction } from '../actions'
import { UiContext } from './uiContext'

export interface AppContext {
  intl: IntlContext
  ui: UiContext
  client: ApolloClient<any>
  dispatch: Dispatch<AppAction>
}

const defaultContext: AppContext = null as any

export const AppContext = React.createContext<AppContext>(defaultContext)
AppContext.displayName = 'AppContext'
