import { ActionType } from 'typesafe-actions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'
import { onlineActions } from './onlineActions'

export const actions = {
  ...dialogActions,
  ...navActions,
  ...onlineActions,
}

export type CoreAction = ActionType<typeof actions>
