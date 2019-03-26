import { ClientDependencies, CoreAction, CoreContext, CoreState } from '@ag/core'
import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { epics } from '../epics/epics'
import { RnState, rootReducer } from '../reducers'

export const createStore = (dependencies: ClientDependencies) => {
  const epicMiddleware = createEpicMiddleware<
    CoreAction,
    CoreAction,
    CoreState,
    ClientDependencies
  >({
    dependencies,
  })

  const middleware = [
    epicMiddleware, //
  ]

  const store = reduxCreateStore<RnState, CoreAction, {}, {}>(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
  )

  const rootEpic = combineEpics<CoreAction, CoreAction, CoreState, ClientDependencies>(...epics)
  epicMiddleware.run(rootEpic)

  return store
}
