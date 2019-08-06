import { AppTable, DbEntity } from '@ag/db'
import { Connection } from 'typeorm'
import { createAsyncAction, createStandardAction } from 'typesafe-actions'

export interface LoadEntities {
  table: AppTable
  deletes: string[]
  entities: Array<DbEntity<any>>
}

export const dbActions = {
  dbInit: createAsyncAction(
    'core/dbInit:request', //
    'core/dbInit:success',
    'core/dbInit:failure'
  )<void, Connection, Error>(),

  dbLogin: createAsyncAction(
    'core/dbLogin:request',
    'core/dbLogin:success',
    'core/dbLogin:failure'
  )<void, Connection, Error>(),

  dbDelete: createAsyncAction(
    'core/dbDelete:request',
    'core/dbDelete:success',
    'core/dbDelete:failure'
  )<void, void, Error>(),

  dbSetInfos: createStandardAction('core/dbSetInfos')<DbInfo[]>(),

  dbEntities: createStandardAction('core/dbEntities')<LoadEntities[]>(),

  dbLogout: createStandardAction('core/dbLogout')(),
}
