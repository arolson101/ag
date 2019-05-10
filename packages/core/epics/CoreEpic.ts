import { Epic } from 'redux-observable'
import { CoreAction } from '../actions'
import { CoreDependencies } from '../context'
import { CoreState } from '../reducers'

export interface CoreEpic extends Epic<CoreAction, CoreAction, CoreState, CoreDependencies> {}
