import { ActionType } from 'typesafe-actions'
import { dbActions } from './dbActions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'
import { queryActions } from './queryActions'
import { settingsActions } from './settingsActions'

export const actions = {
  ...dbActions,
  ...dialogActions,
  ...navActions,
  ...settingsActions,
  ...queryActions,
}

export type CoreAction = ActionType<typeof actions>
