import { CoreAction } from '@ag/core/actions'
import { CoreDependencies } from '@ag/core/context'
import { CoreStore } from '@ag/core/reducers'
import { thunks } from '@ag/core/thunks'
import debug from 'debug'
import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { RnState, rootReducer } from '../reducers'

const log = debug('rn:store')

export const createStore = (dependencies: CoreDependencies) => {
  const middleware = [
    thunk.withExtraArgument(dependencies), //
  ]

  const store = reduxCreateStore<RnState, CoreAction, {}, {}>(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
  ) as CoreStore

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../reducers', () => {
      log('reducers updated')
      store.replaceReducer(rootReducer)
    })
  }

  store.dispatch(thunks.init())

  return store
}
