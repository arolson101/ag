import { actions, CoreAction } from '@ag/core/actions'
import * as Pages from '@ag/core/pages'
import { routerActions } from 'connected-react-router'
import { Middleware } from 'redux'
import { getType } from 'typesafe-actions'

export const navMiddleware: Middleware = ({ dispatch }) => next => (action: CoreAction) => {
  switch (action.type) {
    case getType(actions.nav.home):
      dispatch(routerActions.push(Pages.HomePage.route()))
      break

    case getType(actions.nav.accounts):
      dispatch(routerActions.push(Pages.AccountsPage.route()))
      break

    case getType(actions.nav.account):
      dispatch(routerActions.push(Pages.AccountPage.route(action.payload)))
      break

    case getType(actions.nav.bills):
      dispatch(routerActions.push(Pages.BillsPage.route()))
      break

    case getType(actions.nav.budgets):
      dispatch(routerActions.push(Pages.BudgetsPage.route()))
      break

    case getType(actions.nav.calendar):
      dispatch(routerActions.push(Pages.CalendarPage.route()))
      break
  }

  return next(action)
}
