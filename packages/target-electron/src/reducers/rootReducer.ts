import { appReducers, CoreState } from '@ag/core'
import { combineReducers } from 'redux'
import { router, RouterState } from './routeReducer'

const electronReducers = {
  router,
}

export const rootReducer = combineReducers({
  ...appReducers,
  ...electronReducers,
})

export interface ElectronState extends CoreState {
  router: RouterState
}
