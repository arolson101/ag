import { ActionType } from 'typesafe-actions'
import * as navActions from './navActions'

export const actions = {
  nav: navActions,
}

export type RootAction = ActionType<typeof actions>
