import { DocumentNode, ExecutionArgs, ExecutionResult } from 'graphql'
import { Epic } from 'redux-observable'
import { ObservableInput } from 'rxjs'
import { RootAction } from '../actions'
import { RootState } from '../reducers'
export { createRoute } from './navEpics'

export interface Dependencies {
  runQuery: (
    document: DocumentNode,
    variableValues: ExecutionArgs['variableValues']
  ) => ObservableInput<ExecutionResult<object>>
}

export interface EpicType extends Epic<RootAction, RootAction, RootState, Dependencies> {}
