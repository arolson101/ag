import { ActionType } from 'typesafe-actions'
import { dialogActions } from './dialogActions'
import { loginPage } from './LoginPageActions'
import { navActions } from './navActions'

export * from './dialogActions'
export * from './LoginPageActions'
export * from './navActions'

export const actions = {
  loginPage,
  ...navActions,
  ...dialogActions,
}

export type AppAction = ActionType<typeof actions>
