import { Connection } from 'typeorm'
import { createStandardAction } from 'typesafe-actions'

export const dbActions = {
  dbInitFailure: createStandardAction('core/dbInitFailure')<Error>(),
  dbSetIndex: createStandardAction('core/dbSetIndex')<Connection>(),
  dbSetInfos: createStandardAction('core/dbSetInfos')<DbInfo[]>(),

  dbLoginSuccess: createStandardAction('core/dbLoginSuccess')<Connection>(),
  dbLoginFailure: createStandardAction('core/dbLoginFailure')<Error>(),

  dbLogout: createStandardAction('core/dbLogout')(),
}
