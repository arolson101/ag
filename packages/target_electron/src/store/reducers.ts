import { appReducers, AppState } from '@ag/app/reducers'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'

export const createRootReducer = (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    ...appReducers,
  })

export interface ElectronState extends AppState {
  router: RouterState
}
