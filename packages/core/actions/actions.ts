import { ActionType, createStandardAction } from 'typesafe-actions'
import { dbActions } from './dbActions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'
import { settingsActions } from './settingsActions'

export const actions = {
  init: createStandardAction('core/init')(),

  ...dbActions,
  ...dialogActions,
  ...navActions,
  ...settingsActions,
}

export type CoreAction = ActionType<typeof actions>
