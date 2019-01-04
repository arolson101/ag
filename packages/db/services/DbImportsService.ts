import { Service } from 'typedi'
import { Connection, ConnectionOptions } from 'typeorm'

export interface DbImports {
  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>
}

@Service()
export class DbImportsService implements DbImports {
  openDb: DbImports['openDb']
  deleteDb: DbImports['deleteDb']

  constructor(imports: DbImports) {
    this.openDb = imports.openDb
    this.deleteDb = imports.deleteDb
  }
}
