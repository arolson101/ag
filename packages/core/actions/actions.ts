import { ActionType } from 'typesafe-actions'
import { coreActions } from './coreActions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'
import { onlineActions } from './onlineActions'

export const actions = {
  ...coreActions,
  ...dialogActions,
  ...navActions,
  ...onlineActions,
}

export type CoreAction = ActionType<typeof actions>
