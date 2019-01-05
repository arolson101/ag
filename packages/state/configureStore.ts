import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { RootAction } from './actions'
import { Dependencies, EpicType } from './epics'
import { rootReducer, RootState } from './reducers'

export { EpicType, Dependencies }

export interface RootStore extends Store<RootState, RootAction> {}

export function configureStore(epics: EpicType[], dependencies: Dependencies) {
  const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Dependencies>({
    dependencies,
  })
  const middleware = [epicMiddleware]
  const enhancer = composeWithDevTools(applyMiddleware(...middleware))

  const store = createStore<RootState, RootAction, {}, {}>(rootReducer, enhancer)

  const rootEpic = combineEpics<RootAction, RootAction, RootState, Dependencies>(...epics)
  epicMiddleware.run(rootEpic)

  return store
}
