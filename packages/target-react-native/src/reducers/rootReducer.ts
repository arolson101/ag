import { CoreAction } from '@ag/core/actions'
import { coreReducers, CoreState } from '@ag/core/reducers'
import { combineReducers, Store } from 'redux'

const rnReducers = {}

export const rootReducer = combineReducers({
  ...coreReducers,
  ...rnReducers,
})

export interface RnState extends CoreState {}

export type RnStore = Store<RnState, CoreAction>
