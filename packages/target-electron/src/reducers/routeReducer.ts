import { actions, CoreAction, HomePage } from '@ag/core'
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

export const router = (state: RouterState = initialState, action: CoreAction): RouterState => {
  switch (action.type) {
    // case getType(actions.nav.login):
    //   state.history.push(href(LoginPage.id))
    //   break

    case getType(actions.nav.home):
      state.history.push(href(HomePage.id))
      break

    // case getType(actions.nav.bank):
    // state.history.push(href(BankPage.id))
    // break
  }
  return state
}
