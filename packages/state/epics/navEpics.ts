import { concat, of } from 'rxjs'
import { delay, filter, ignoreElements, mergeMap, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { EpicType } from './index'

const navAction: EpicType = (action$, state$, { logger }) =>
  action$.pipe(
    filter(isActionOf(actions.nav.login)),
    tap(action => {
      logger(`action type must be equal: === ${action.type}`)
    }),
    ignoreElements()
  )

const navLogin: EpicType = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.nav.login)),
    mergeMap(action =>
      concat(
        of(actions.nav.loading.request()),
        delay(1000),
        of(actions.nav.loading.success())
      )
    )
  )

export const navEpics = [
  navAction, //
  navLogin,
]
