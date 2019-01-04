import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { createStore, applyMiddleware, Store } from 'redux'
import { rootReducer, RootState } from './reducers'
import { createEpicMiddleware } from 'redux-observable'
import { rootEpic, Services } from './epics'
import { RootAction } from './actions'

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
