import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { AppAction } from '../actions'
import { Dependencies, EpicType } from '../epics'
import { rootReducer, AppState, selectors } from '../reducers'

export { EpicType, Dependencies, AppState as RootState, AppAction as RootAction, selectors }

export interface RootStore extends Store<AppState, AppAction> {}

export function configureStore(epics: EpicType[], dependencies: Dependencies): RootStore {
  const epicMiddleware = createEpicMiddleware<AppAction, AppAction, AppState, Dependencies>({
    dependencies,
  })
  const middleware = [epicMiddleware]
  const enhancer = composeWithDevTools(applyMiddleware(...middleware))

  const store = createStore<AppState, AppAction, {}, {}>(rootReducer, enhancer)

  const rootEpic = combineEpics<AppAction, AppAction, AppState, Dependencies>(...epics)
  epicMiddleware.run(rootEpic)

  return store
}
