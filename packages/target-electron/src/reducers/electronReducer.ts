import { CoreAction } from '@ag/core/actions'
import { coreReducers, CoreState, selectors } from '@ag/core/reducers'
import { connectRouter, RouterAction, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers, Reducer, Store } from 'redux'

export type ElectronAction = CoreAction | RouterAction
export type ElectronStore = Store<ElectronState, ElectronAction>

export interface ElectronState extends CoreState {
  router: RouterState
}

const electronReducers = (history: History) => ({
  router: connectRouter(history),
})

export const createRootReducer = (history: History): Reducer<ElectronState> =>
  combineReducers({
    ...coreReducers,
    ...electronReducers(history),
  })

export const electronSelectors = {
  ...selectors,
}
