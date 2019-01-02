import { concat, of } from 'rxjs'
import { delay, filter, ignoreElements, mergeMap, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { EpicType } from './index'

const navAction: EpicType = (action$, state$, { logger }) =>
  action$.pipe(
    // tap(action => console.log('navAction got action', action)),
    filter(isActionOf(actions.nav.login)),
    tap(action => {
      logger(`action type must be equal: === ${action.type}`)
    }),
    ignoreElements()
  )

const navLogin: EpicType = (action$, state$) =>
  action$.pipe(
    // tap(action => console.log('navLogin got action', action)),
    filter(isActionOf(actions.nav.home)),
    mergeMap(action =>
      concat(
        of(actions.nav.loading.request()),
        of(actions.nav.loading.success()).pipe(delay(1001))
      )
    )
  )

export const navEpics = [
  navAction, //
  navLogin,
]
