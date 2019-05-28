import { CoreDependencies, CoreDispatch } from '@ag/core/context'
import { routerMiddleware } from 'connected-react-router'
import debug from 'debug'
import { applyMiddleware, createStore as reduxCreateStore, Middleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { CoreState, createRootReducer, ElectronAction, ElectronState } from '../reducers'
import { navMiddleware } from './navMiddleware'

const log = debug('electron:electronStore')

export const createStore = (hist: HistoryType, dependencies: CoreDependencies) => {
  const middleware: Array<Middleware<CoreDependencies, CoreState, CoreDispatch>> = [
    thunk.withExtraArgument(dependencies),
    routerMiddleware(hist),
    navMiddleware,
  ]

  const store = reduxCreateStore<ElectronState, ElectronAction, {}, {}>(
    createRootReducer(hist),
    composeWithDevTools(applyMiddleware(...middleware))
  )

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../reducers', () => {
      log('reducers updated')
      store.replaceReducer(createRootReducer(hist))
    })
  }

  return store
}
