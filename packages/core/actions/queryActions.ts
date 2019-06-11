import { Record as DbRecord } from '@ag/db'
import { createStandardAction } from 'typesafe-actions'

export interface WrittenChanges {
  table: Function
  deletes: string[]
  entities: Array<DbRecord<any>>
}

export const queryActions = {
  entitiesLoaded: createStandardAction('core/entitiesLoaded')<
    Array<{
      table: Function
      entities: Array<DbRecord<any>>
    }>
  >(),

  changesWritten: createStandardAction('core/changesWritten')<WrittenChanges[]>(),
}
