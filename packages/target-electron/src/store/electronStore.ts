import { actions, CoreAction } from '@ag/core/actions'
import { CoreDependencies } from '@ag/core/context'
import { CoreState } from '@ag/core/reducers'
import debug from 'debug'
import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { ActionsObservable, createEpicMiddleware, StateObservable } from 'redux-observable'
import { BehaviorSubject } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { rootEpic } from '../epics'
import { electronReducer, ElectronState } from '../reducers'

const log = debug('electron:electronStore')

export const createStore = (dependencies: CoreDependencies) => {
  const epicMiddleware = createEpicMiddleware<CoreAction, CoreAction, CoreState, CoreDependencies>({
    dependencies,
  })

  const middleware = [
    epicMiddleware, //
  ]

  const store = reduxCreateStore<ElectronState, CoreAction, {}, {}>(
    electronReducer,
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

  log('store init')
  store.dispatch(actions.init())

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../epics', () => {
      log('epics updated')
      epic$.next(rootEpic)
    })
    module.hot.accept('../reducers', () => {
      log('reducers updated')
      store.replaceReducer(electronReducer)
    })
  }

  return store
}
