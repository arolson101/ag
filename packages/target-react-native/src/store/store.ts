import { AppAction, AppState, Dependencies } from '@ag/app'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { epics } from '../epics/epics'
import { RnState, rootReducer } from '../reducers'
import { syncNavState } from './syncNavState'

const epicMiddleware = createEpicMiddleware<AppAction, AppAction, AppState, Dependencies>()

const middleware = [
  epicMiddleware, //
]

export const store = createStore<RnState, AppAction, {}, {}>(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

syncNavState(store)

const rootEpic = combineEpics<AppAction, AppAction, AppState, Dependencies>(...epics)
epicMiddleware.run(rootEpic)
