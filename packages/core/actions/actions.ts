import { ActionType } from 'typesafe-actions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'

export const actions = {
  ...dialogActions,
  ...navActions,
}

export type AppAction = ActionType<typeof actions>