import {
  AccountPage,
  AccountsPage,
  actions,
  BillsPage,
  BudgetsPage,
  CalendarPage,
  CoreAction,
  HomePage,
} from '@ag/core'
import { createMemoryHistory, MemoryHistory } from 'history'
import { getType } from 'typesafe-actions'

export interface RouterState {
  history: MemoryHistory
}

export const routerSelectors = {
  getHistory: (state: RouterState) => state.history,
}

const initialState = {
  history: createMemoryHistory(),
}

export const router = (state: RouterState = initialState, action: CoreAction): RouterState => {
  switch (action.type) {
    // case getType(actions.nav.login):
    //   state.history.push(href(LoginPage.id))
    //   break

    case getType(actions.nav.home):
      state.history.push(HomePage.route())
      break

    case getType(actions.nav.accounts):
      state.history.push(AccountsPage.route())
      break

    case getType(actions.nav.account):
      state.history.push(AccountPage.route(action.payload))
      break

    case getType(actions.nav.bills):
      state.history.push(BillsPage.route())
      break

    case getType(actions.nav.budgets):
      state.history.push(BudgetsPage.route())
      break

    case getType(actions.nav.calendar):
      state.history.push(CalendarPage.route())
      break

    // case getType(actions.nav.bank):
    // state.history.push(href(BankPage.id))
    // break
  }
  return state
}
