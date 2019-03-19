import { appReducers, CoreAction, CoreState } from '@ag/core'
import { combineReducers, Store } from 'redux'

const rnReducers = {}

export const rootReducer = combineReducers({
  ...appReducers,
  ...rnReducers,
})

export interface RnState extends CoreState {}

export type RnStore = Store<RnState, CoreAction>
