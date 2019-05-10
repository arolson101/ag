import { actions, CoreAction } from '@ag/core/actions'
import { CoreDependencies } from '@ag/core/context'
import { CoreState } from '@ag/core/reducers'
import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { ActionsObservable, createEpicMiddleware, StateObservable } from 'redux-observable'
import { BehaviorSubject } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { rootEpic } from '../epics'
import { RnState, rootReducer } from '../reducers'

export const createStore = (dependencies: CoreDependencies) => {
  const epicMiddleware = createEpicMiddleware<CoreAction, CoreAction, CoreState, CoreDependencies>({
    dependencies,
  })

  const middleware = [
    epicMiddleware, //
  ]

  const store = reduxCreateStore<RnState, CoreAction, {}, {}>(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
  )

  const epic$ = new BehaviorSubject(rootEpic)
  // Every time a new epic is given to epic$ it will unsubscribe from the previous one then
  // call and subscribe to the new one because of how switchMap works
  const hotReloadingEpic = (
    action$: ActionsObservable<CoreAction>,
    state$: StateObservable<CoreState>,
    deps: CoreDependencies
  ) => epic$.pipe(switchMap(epic => epic(action$, state$, deps)))

  epicMiddleware.run(hotReloadingEpic)
  if (module.hot) {
    module.hot.accept('../epics', () => {
      const nextRootEpic = require('../epics').rootEpic
      epic$.next(nextRootEpic)
    })
  }

  store.dispatch(actions.init())

  return store
}
