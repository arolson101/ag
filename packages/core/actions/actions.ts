import { ActionType, createStandardAction } from 'typesafe-actions'
import { dbActions } from './dbActions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'
import { onlineActions } from './onlineActions'
import { settingsActions } from './settingsActions'

export const actions = {
  init: createStandardAction('core/init')(),

  ...dbActions,
  ...dialogActions,
  ...navActions,
  ...onlineActions,
  ...settingsActions,
}

export type CoreAction = ActionType<typeof actions>
