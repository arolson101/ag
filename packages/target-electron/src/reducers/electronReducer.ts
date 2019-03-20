import { appReducers, CoreState } from '@ag/core'
import { combineReducers } from 'redux'
import { router, RouterState } from './routeReducer'
import { settings, settingsSelectors, SettingsState } from './settingsReducer'

const electronReducers = {
  settings,
  router,
}

export const electronReducer = combineReducers({
  ...appReducers,
  ...electronReducers,
})

export interface ElectronState extends CoreState {
  router: RouterState
  settings: SettingsState
}

export const selectors = {
  getSidebarWidth: (state: ElectronState) => settingsSelectors.getSidebarWidth(state.settings),
}
