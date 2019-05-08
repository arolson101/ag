import { Connection } from 'typeorm'
import { createAsyncAction, createStandardAction } from 'typesafe-actions'

export const dbActions = {
  dbInit: createAsyncAction(
    'core/dbInit:request', //
    'core/dbInit:success',
    'core/dbInit:failure'
  )<
    void,
    {
      connection: Connection //
      dbs: DbInfo[]
    },
    Error
  >(),

  dbLogin: createAsyncAction(
    'core/dbLogin:request', //
    'core/dbLogin:success',
    'core/dbLogin:failure'
  )<
    { dbId: string; password: string }, //
    { connection: Connection },
    Error
  >(),

  dbCreate: createAsyncAction(
    'core/dbCreate:request', //
    'core/dbCreate:success',
    'core/dbCreate:failure'
  )<
    { name: string; password: string }, //
    { connection: Connection; dbs: DbInfo[] },
    Error
  >(),

  dbLogout: createStandardAction('core/logout')(),
}
