import { Epic } from 'redux-observable'
import { CoreAction } from '../actions'
import { ClientDependencies } from '../context'
import { CoreState } from '../reducers'

export interface CoreEpic extends Epic<CoreAction, CoreAction, CoreState, ClientDependencies> {}
