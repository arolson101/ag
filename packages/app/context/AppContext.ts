import { ApolloClient } from 'apollo-client'
import React from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { RouteContext } from './routeContext'
import { UiContext } from './uiContext'

export interface AppContext {
  intl: IntlContext
  ui: UiContext
  client: ApolloClient<any>
  router: RouteContext
}

const defaultContext: AppContext = null as any

export const AppContext = React.createContext<AppContext>(defaultContext)
AppContext.displayName = 'AppContext'
