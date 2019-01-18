import { AppAction, Dependencies } from '@ag/app'
import { AppState } from '@ag/app/reducers'
import { DbImports, initDb } from '@ag/db'
import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { epics } from '../epics/epics'
import { ElectronState, rootReducer } from '../reducers'
import { deleteDb, openDb } from './openDb.electron'

export const dbImports: DbImports = {
  openDb,
  deleteDb,
}

// const runQuery = initDb(dbImports)

// const dependencies: Dependencies = {
//   runQuery,
// }

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
