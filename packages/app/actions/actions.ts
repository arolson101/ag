import { ActionType } from 'typesafe-actions'
import { loginPage } from './LoginPageActions'
import { nav } from './navActions'

export const actions = {
  loginPage,
  nav,
}

export type AppAction = ActionType<typeof actions>
