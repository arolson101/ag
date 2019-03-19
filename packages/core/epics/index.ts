import { DocumentNode, ExecutionArgs, ExecutionResult } from 'graphql'
import { Epic } from 'redux-observable'
import { ObservableInput } from 'rxjs'
import { CoreAction } from '../actions'
import { CoreState } from '../reducers'

export interface Dependencies {
  runQuery: <Variables = ExecutionArgs['variableValues'], Result = object>(
    document: DocumentNode,
    variableValues: Variables
  ) => ObservableInput<ExecutionResult<Result>>
}

export interface CoreEpic extends Epic<CoreAction, CoreAction, CoreState, Dependencies> {}

export const coreEpics = []
