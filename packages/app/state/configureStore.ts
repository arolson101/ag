import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { AppAction } from '../actions'
import { AppEpic, Dependencies } from '../epics'
import { AppState, rootReducer, selectors } from '../reducers'

export { AppEpic, Dependencies, AppState, AppAction, selectors }

export interface AppStore extends Store<AppState, AppAction> {}

// export function configureStore(epics: AppEpic[], dependencies: Dependencies): AppStore {
//   const epicMiddleware = createEpicMiddleware<AppAction, AppAction, AppState, Dependencies>({
//     dependencies,
//   })
//   const middleware = [epicMiddleware]
//   const enhancer = composeWithDevTools(applyMiddleware(...middleware))

//   const store = createStore<AppState, AppAction, {}, {}>(rootReducer, enhancer)

//   const rootEpic = combineEpics<AppAction, AppAction, AppState, Dependencies>(...epics)
//   epicMiddleware.run(rootEpic)

//   return store
// }
