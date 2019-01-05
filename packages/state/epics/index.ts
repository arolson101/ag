import { Epic } from 'redux-observable'
import { ObservableInput } from 'rxjs'
import { RootAction } from '../actions'
import { RootState } from '../reducers'
export { createRoute } from './navEpics'

export interface Dependencies {
  runQuery: (query: string) => ObservableInput<object>
}

export interface EpicType extends Epic<RootAction, RootAction, RootState, Dependencies> {}
