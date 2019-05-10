import { appReducers, CoreState, selectors } from '@ag/core/reducers'
import { combineReducers } from 'redux'
import { router, routerSelectors, RouterState } from './routeReducer'

const electronReducers = {
  router,
}

export const electronReducer = combineReducers({
  ...appReducers,
  ...electronReducers,
})

export interface ElectronState extends CoreState {
  router: RouterState
}

export const electronSelectors = {
  ...selectors,

  getHistory: (state: ElectronState) => routerSelectors.getHistory(state.router),
}
