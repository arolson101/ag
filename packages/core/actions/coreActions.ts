import { Connection } from 'typeorm'
import { createStandardAction } from 'typesafe-actions'

export const coreActions = {
  init: createStandardAction('core/init')(),

  login: createStandardAction('core/login')<{ dbId: string; password: string }>(),
  create: createStandardAction('core/create')<{ password: string }>(),
  logout: createStandardAction('core/logout')(),

  setIndexConnection: createStandardAction('core/setIndexConnection')<{ index: Connection }>(),
  setAppConnection: createStandardAction('core/setAppConnection')<{ app: Connection }>(),
}
