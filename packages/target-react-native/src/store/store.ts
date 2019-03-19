import { CoreAction, CoreState, Dependencies } from '@ag/core'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { epics } from '../epics/epics'
import { RnState, rootReducer } from '../reducers'
import { syncNavState } from './syncNavState'

const epicMiddleware = createEpicMiddleware<CoreAction, CoreAction, CoreState, Dependencies>()

const middleware = [
  epicMiddleware, //
]

export const store = createStore<RnState, CoreAction, {}, {}>(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

syncNavState(store)

const rootEpic = combineEpics<CoreAction, CoreAction, CoreState, Dependencies>(...epics)
epicMiddleware.run(rootEpic)
