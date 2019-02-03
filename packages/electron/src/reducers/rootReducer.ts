import { appReducers, AppState, initialAppState } from '@ag/app'
import { combineReducers } from 'redux'
import { dialog, DialogState } from './dialogReducer'
import { router, RouterState } from './routeReducer'

const electronReducers = {
  dialog,
  router,
}

export const initialState = {
  ...initialAppState,
}

export const rootReducer = combineReducers({
  ...appReducers,
  ...electronReducers,
})

export interface ElectronState extends AppState {
  dialog: DialogState
  router: RouterState
}
