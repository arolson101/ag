import { appReducers, AppState } from '@ag/app'
import { combineReducers } from 'redux'
import { router, RouterState } from './router'

const electronReducers = {
  router,
}

export const rootReducer = combineReducers({
  ...appReducers,
  ...electronReducers,
})

export interface ElectronState extends AppState {
  router: RouterState
}
