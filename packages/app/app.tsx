import { DbImports, initDb } from '@ag/db'
import React from 'react'

const dbImports: DbImports = {
  openDb: () => undefined as any,
  deleteDb: () => undefined as any,
}

const runQuery = initDb(dbImports)

export class App extends React.PureComponent {
  render() {
    return <>app</>
  }
}
