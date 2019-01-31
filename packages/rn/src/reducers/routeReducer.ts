import { actions, AppAction, HomePage } from '@ag/app'
import { getType } from 'typesafe-actions'

export interface RouterState {}

const initialState: RouterState = {}

export const router = (state: RouterState = initialState, action: AppAction): RouterState => {
  // switch (action.type) {
  //   case getType(actions.nav.login):
  //     state.history.push(href(LoginPage.id))
  //     break

  //   case getType(actions.nav.home):
  //     state.history.push(href(HomePage.id))
  //     break

  //   // case getType(actions.nav.bank):
  //   // state.history.push(href(BankPage.id))
  //   // break
  // }
  return state
}
