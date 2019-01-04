import { log } from '@ag/util/log'
import { from } from 'rxjs'
import { filter, map, mergeMap, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { EpicType } from './index'

export const createRoute = <Params = void>(url: string, query: string) => {
  const actionCreator = (params: Params) => actions.nav.navigate.request({ url, params })

  const epicHandler: EpicType = (action$, state$, { runQuery }) =>
    action$.pipe(
      filter(isActionOf(actions.nav.navigate.request)),
      filter(action => action.payload.url === url),
      tap(action => log.info(`navigating to ${url}, running query`)),
      mergeMap(action =>
        from(runQuery(query)).pipe(
          tap(data => log.info(`navigation success with query result %o`, data)),
          map(data => actions.nav.navigate.success({ url: action.payload.url, data }))
        )
      )
      // tap(action => console.log('result', action))
    )

  return { ac: actionCreator, eh: epicHandler }
}
