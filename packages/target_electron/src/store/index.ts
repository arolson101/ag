import { AppAction, AppState, Dependencies } from '@ag/app'
import { DbImports, initDb } from '@ag/db'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { epics } from './epics'
import { deleteDb, openDb } from './openDb.electron'
import { createRootReducer, ElectronState } from './reducers'

export const history = createBrowserHistory()

const dbImports: DbImports = {
  openDb,
  deleteDb,
}

const runQuery = initDb(dbImports)

const dependencies: Dependencies = {
  runQuery,
}

const epicMiddleware = createEpicMiddleware<AppAction, AppAction, AppState, Dependencies>({
  dependencies,
})

const middleware = [
  epicMiddleware, //
  routerMiddleware(history),
]

export const store = createStore<ElectronState, AppAction, {}, {}>(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(...middleware))
)

const rootEpic = combineEpics<AppAction, AppAction, AppState, Dependencies>(...epics)
epicMiddleware.run(rootEpic)
