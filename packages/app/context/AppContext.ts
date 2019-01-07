import React from 'react'
import { InjectedIntl as IntlContext } from 'react-intl'
import { UiContext } from './uiContext'

export interface AppContext {
  intl: IntlContext
  ui: UiContext
}

const defaultContext: AppContext = null as any

export const AppContext = React.createContext<AppContext>(defaultContext)
AppContext.displayName = 'AppContext'
