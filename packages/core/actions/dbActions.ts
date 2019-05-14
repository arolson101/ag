import { Connection } from 'typeorm'
import { createAsyncAction, createStandardAction } from 'typesafe-actions'

export const dbActions = {
  dbInitFailure: createStandardAction('core/dbInitFailure')<Error>(),
  dbSetIndex: createStandardAction('core/dbSetIndex')<Connection>(),
  dbSetInfos: createStandardAction('core/dbSetInfos')<DbInfo[]>(),

  dbOpen: createStandardAction('core/dbOpen')<{ dbId: string; password: string }>(),
  dbCreate: createStandardAction('core/dbCreate')<{ name: string; password: string }>(),

  dbLoginSuccess: createStandardAction('core/dbLoginSuccess')<Connection>(),

  dbLoginFailure: createStandardAction('core/dbLoginFailure')<Error>(),

  dbLogout: createStandardAction('core/dbLogout')(),

  deleteDb: createStandardAction('core/deleteDb')<{
    dbId: string
  }>(),

  deleteBank: createStandardAction('core/deleteBank')<{
    bank: {
      id: string
      name: string
    }
    onComplete: () => any
  }>(),

  deleteAccount: createStandardAction('core/deleteAccount')<{
    account: {
      id: string
      name: string
    }
    onComplete: () => any
  }>(),
}
