// import { IntlAction } from 'react-intl-redux'
import { ActionType } from 'typesafe-actions'
import { dbActions } from './dbActions'
import { dialogActions } from './dialogActions'
import { navActions } from './navActions'

export const actions = {
  ...dbActions,
  ...dialogActions,
  ...navActions,
}

export type AppAction = ActionType<typeof actions>
