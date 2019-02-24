import { Connection, ConnectionOptions } from 'typeorm'

export interface DbContext {
  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>
}
