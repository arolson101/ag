import { actions } from '@ag/core/actions'
import * as Pages from '@ag/core/pages'
import { routerActions } from 'connected-react-router'
import { filter, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { ElectronEpic } from './rootEpic'

export const navEpics: ElectronEpic[] = [
  action$ =>
    action$.pipe(
      filter(isActionOf(actions.nav.home)),
      map(action => routerActions.push(Pages.HomePage.route()))
    ),

  action$ =>
    action$.pipe(
      filter(isActionOf(actions.nav.accounts)),
      map(action => routerActions.push(Pages.AccountsPage.route()))
    ),

  action$ =>
    action$.pipe(
      filter(isActionOf(actions.nav.account)),
      map(action => routerActions.push(Pages.AccountPage.route(action.payload)))
    ),

  action$ =>
    action$.pipe(
      filter(isActionOf(actions.nav.bills)),
      map(action => routerActions.push(Pages.BillsPage.route()))
    ),

  action$ =>
    action$.pipe(
      filter(isActionOf(actions.nav.budgets)),
      map(action => routerActions.push(Pages.BudgetsPage.route()))
    ),

  action$ =>
    action$.pipe(
      filter(isActionOf(actions.nav.calendar)),
      map(action => routerActions.push(Pages.CalendarPage.route()))
    ),
]
