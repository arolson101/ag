import { DbEntity, DbTable } from '@ag/db'
import { createStandardAction } from 'typesafe-actions'

export interface LoadEntities {
  table: DbTable
  deletes: string[]
  entities: Array<DbEntity<any>>
}

export const queryActions = {
  dbEntities: createStandardAction('core/dbEntities')<LoadEntities[]>(),
}
