import { CoreAction } from '@ag/core/actions'
import { appReducers, CoreState } from '@ag/core/reducers'
import { combineReducers, Store } from 'redux'

const rnReducers = {}

export const rootReducer = combineReducers({
  ...appReducers,
  ...rnReducers,
})

export interface RnState extends CoreState {}

export type RnStore = Store<RnState, CoreAction>
