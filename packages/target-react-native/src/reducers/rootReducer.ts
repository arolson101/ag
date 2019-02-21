import { AppAction, appReducers, AppState } from '@ag/app'
import { combineReducers, Store } from 'redux'

const rnReducers = {}

export const rootReducer = combineReducers({
  ...appReducers,
  ...rnReducers,
})

export interface RnState extends AppState {}

export type RnStore = Store<RnState, AppAction>
