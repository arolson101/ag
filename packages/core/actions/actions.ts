import { ActionType } from 'typesafe-actions'
import { dbActions } from './dbActions'
import { dialogActions } from './dialogActions'
import { imageActions } from './imageActions'
import { navActions } from './navActions'
import { settingsActions } from './settingsActions'
import { themeActions } from './themeActions'

export { LoadEntities } from './dbActions'

export const actions = {
  ...dbActions,
  ...dialogActions,
  ...imageActions,
  ...navActions,
  ...settingsActions,
  ...themeActions,
}

export type CoreAction = ActionType<typeof actions>
