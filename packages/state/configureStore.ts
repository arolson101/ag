import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { createEpicMiddleware } from 'redux-observable'
import { RootAction } from './actions'
import { rootEpic, Services } from './epics'
import { rootReducer, RootState } from './reducers'

export { Services }

export interface RootStore extends Store<RootState, RootAction> {}

export function configureStore(services: Services) {
  const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Services>({
    dependencies: services,
  })
  const middleware = [epicMiddleware]
  const enhancer = composeWithDevTools(applyMiddleware(...middleware))

  const store = createStore<RootState, RootAction, {}, {}>(rootReducer, enhancer)
  epicMiddleware.run(rootEpic)

  return store
}
