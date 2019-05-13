import { CoreDependencies } from '@ag/core/context'
import { routerMiddleware } from 'connected-react-router'
import debug from 'debug'
import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { ActionsObservable, createEpicMiddleware, StateObservable } from 'redux-observable'
import { BehaviorSubject } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { rootEpic } from '../epics'
import { createRootReducer, ElectronAction, ElectronState } from '../reducers'

const log = debug('electron:electronStore')

export const createStore = (hist: HistoryType, dependencies: CoreDependencies) => {
  const epicMiddleware = createEpicMiddleware<
    ElectronAction,
    ElectronAction,
    ElectronState,
    CoreDependencies
  >({
    dependencies,
  })

  const middleware = [
    routerMiddleware(hist), //
    epicMiddleware,
  ]

  const store = reduxCreateStore<ElectronState, ElectronAction, {}, {}>(
    createRootReducer(hist),
    composeWithDevTools(applyMiddleware(...middleware))
  )

  const epic$ = new BehaviorSubject(rootEpic)
  // Every time a new epic is given to epic$ it will unsubscribe from the previous one then
  // call and subscribe to the new one because of how switchMap works
  const hotReloadingEpic = (
    action$: ActionsObservable<ElectronAction>,
    state$: StateObservable<ElectronState>,
    deps: CoreDependencies
  ) => epic$.pipe(switchMap(epic => epic(action$, state$, deps)))

  epicMiddleware.run(hotReloadingEpic)

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../epics', () => {
      log('epics updated')
      epic$.next(rootEpic)
    })
    module.hot.accept('../reducers', () => {
      log('reducers updated')
      store.replaceReducer(createRootReducer(hist))
    })
  }

  return store
}
