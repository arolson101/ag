import { AppAction, appReducers, AppState } from '@ag/core'
import { combineReducers, Store } from 'redux'

const rnReducers = {}

export const rootReducer = combineReducers({
  ...appReducers,
  ...rnReducers,
})

export interface RnState extends AppState {}

export type RnStore = Store<RnState, AppAction>
