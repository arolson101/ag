import { ActionType } from 'typesafe-actions'
import { dbActions } from './dbActions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'
import { settingsActions } from './settingsActions'

export { LoadEntities } from './dbActions'

export const actions = {
  ...dbActions,
  ...dialogActions,
  ...navActions,
  ...settingsActions,
}

export type CoreAction = ActionType<typeof actions>
