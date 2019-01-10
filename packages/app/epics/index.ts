import { DocumentNode, ExecutionArgs, ExecutionResult } from 'graphql'
import { Epic } from 'redux-observable'
import { ObservableInput } from 'rxjs'
import { AppAction } from '../actions'
import { AppState } from '../reducers'
import { loginPageEpics } from './LoginPageEpics'

export interface Dependencies {
  runQuery: <Variables = ExecutionArgs['variableValues'], Result = object>(
    document: DocumentNode,
    variableValues: Variables
  ) => ObservableInput<ExecutionResult<Result>>
}

export interface AppEpic extends Epic<AppAction, AppAction, AppState, Dependencies> {}

export const appEpics = [
  ...loginPageEpics, //
]
