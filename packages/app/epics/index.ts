import { DocumentNode, ExecutionArgs, ExecutionResult } from 'graphql'
import { Epic } from 'redux-observable'
import { ObservableInput } from 'rxjs'
import { AppAction } from '../actions'
import { AppState } from '../reducers'
export { createRoute } from './navEpics'

export interface Dependencies {
  runQuery: <Variables = ExecutionArgs['variableValues'], Result = object>(
    document: DocumentNode,
    variableValues: Variables
  ) => ObservableInput<ExecutionResult<Result>>
}

export interface EpicType extends Epic<AppAction, AppAction, AppState, Dependencies> {}
