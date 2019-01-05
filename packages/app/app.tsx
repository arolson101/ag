import { DbImports, initDb } from '@ag/db'
import { configureStore, Dependencies } from '@ag/state'
import React from 'react'

const dbImports: DbImports = {
  openDb: () => undefined as any,
  deleteDb: () => undefined as any,
}

const runQuery = initDb(dbImports)

const dependencies: Dependencies = {
  runQuery,
}
const store = configureStore([], dependencies)

export class App extends React.PureComponent {
  render() {
    return <>app</>
  }
}
