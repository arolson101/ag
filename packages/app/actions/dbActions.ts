import { Connection } from 'typeorm'
import { createStandardAction } from 'typesafe-actions'

export const dbActions = {
  setIndex: createStandardAction('db/setIndex')<Connection>(),
  openApp: createStandardAction('db/openApp')<Connection>(),
  closeApp: createStandardAction('db/closeApp')(),
}
