import { Online } from '@ag/online'
import { Epic } from 'redux-observable'
import { CoreAction } from '../actions'
import { SystemCallbacks, UiContext } from '../context'
import { CoreState } from '../reducers'

export interface CoreDependencies {
  // client: ApolloClient<any>
  online: Online
  ui: UiContext
  sys: SystemCallbacks
}

export interface CoreEpic extends Epic<CoreAction, CoreAction, CoreState, CoreDependencies> {}
