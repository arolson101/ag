import { ActionType, createStandardAction } from 'typesafe-actions'
import { dbActions } from './dbActions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'
import { onlineActions } from './onlineActions'

export const actions = {
  init: createStandardAction('core/init')(),

  ...dbActions,
  ...dialogActions,
  ...navActions,
  ...onlineActions,
}

export type CoreAction = ActionType<typeof actions>
