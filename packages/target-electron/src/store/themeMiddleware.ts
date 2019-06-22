import { actions, CoreAction } from '@ag/core/actions'
import { selectors } from '@ag/core/reducers'
import debug from 'debug'
import { Middleware } from 'redux'
import { getType } from 'typesafe-actions'
import { ElectronState } from '../reducers'

const log = debug('electron:themeMiddleware')

declare global {
  interface Window {
    less: typeof import('less')
  }
}

export const updateThemeVariables = (color: string, mode: 'light' | 'dark') => {
  window.less.modifyVars({
    '@primary-color': color,
  })
}

const setPrimaryColor = (getState: () => ElectronState, color: string) => {
  updateThemeVariables(color, selectors.getThemeMode(getState()))
}

const setThemeMode = (getState: () => ElectronState, mode: 'light' | 'dark') => {
  updateThemeVariables(selectors.getThemeColor(getState()), mode)
}

export const themeMiddleware: Middleware = ({ dispatch, getState }) => next => (
  action: CoreAction
) => {
  // log('getState %o', getState())
  switch (action.type) {
    case getType(actions.setThemeColor):
      setPrimaryColor(getState, action.payload)
      break

    case getType(actions.setThemeMode):
      setThemeMode(getState, action.payload)
      break
  }

  return next(action)
}
