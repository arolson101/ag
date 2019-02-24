import { AppAction, AppState, Dependencies } from '@ag/core'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { epics } from '../epics/epics'
import { ElectronState, rootReducer } from '../reducers'

const epicMiddleware = createEpicMiddleware<AppAction, AppAction, AppState, Dependencies>({
  // dependencies,
})

const middleware = [
  epicMiddleware, //
  // routerMiddleware(history),
]

export const store = createStore<ElectronState, AppAction, {}, {}>(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

const rootEpic = combineEpics<AppAction, AppAction, AppState, Dependencies>(...epics)
epicMiddleware.run(rootEpic)
