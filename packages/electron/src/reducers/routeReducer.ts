import { actions, AppAction } from '@ag/app'
import { BankEditPage, HomePage, LoginPage } from '@ag/app/pages'
import { createBrowserHistory, History } from 'history'
import { stringify } from 'query-string'
import { getType } from 'typesafe-actions'

export interface RouterState {
  history: History
}

export const history = createBrowserHistory()

const initialState = {
  history,
}

const href = (id: string, props?: object) =>
  history.createHref({
    pathname: `${id}`,
    hash: '',
    search: props ? stringify(props) : '',
    state: {},
  })

export const router = (state: RouterState = initialState, action: AppAction): RouterState => {
  switch (action.type) {
    case getType(actions.nav.login):
      state.history.push(href(LoginPage.id))
      break

    case getType(actions.nav.home):
      state.history.push(href(HomePage.id))
      break

    // case getType(actions.nav.bank):
    // state.history.push(href(BankPage.id))
    // break

    case getType(actions.nav.bankCreate):
      state.history.push(href(BankEditPage.id))
      break

    case getType(actions.nav.bankEdit):
      state.history.push(href(BankEditPage.id, action.payload))
      break
  }
  return state
}
