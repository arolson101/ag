import { appReducers, AppState, initialAppState } from '@ag/app'
import { combineReducers } from 'redux'
import { router, RouterState } from './routeReducer'

const rnReducers = {
  router,
}

export const initialState = {
  ...initialAppState,
}

export const rootReducer = combineReducers({
  ...appReducers,
  ...rnReducers,
})

export interface RnState extends AppState {
  router: RouterState
}
