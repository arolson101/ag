import { CoreAction, CoreState, Dependencies } from '@ag/core'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { epics } from '../epics/epics'
import { electronReducer, ElectronState } from '../reducers'

const epicMiddleware = createEpicMiddleware<CoreAction, CoreAction, CoreState, Dependencies>({
  // dependencies,
})

const middleware = [
  epicMiddleware, //
  // routerMiddleware(history),
]

export const store = createStore<ElectronState, CoreAction, {}, {}>(
  electronReducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

const rootEpic = combineEpics<CoreAction, CoreAction, CoreState, Dependencies>(...epics)
epicMiddleware.run(rootEpic)
