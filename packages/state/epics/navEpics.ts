import { log } from '@ag/util/log'
import { DocumentNode } from 'graphql'
import { from, of } from 'rxjs'
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { EpicType } from './index'

export const createRoute = <Params = void>(url: string, query: DocumentNode) => {
  const actionCreator = (params: Params) => actions.nav.navigate.request({ url, params })

  const epicHandler: EpicType = (action$, state$, { runQuery }) =>
    action$.pipe(
      filter(isActionOf(actions.nav.navigate.request)),
      filter(action => action.payload.url === url),
      tap(action => log.nav(`${url}, run query %O params %o`, query, action.payload.params)),
      mergeMap(action =>
        from(runQuery(query, action.payload.params)).pipe(
          map(({ data, errors }) => {
            if (errors) {
              log.nav(`${url} failure: %o`, errors)
              return actions.nav.navigate.failure({ url: action.payload.url, errors })
            } else {
              log.nav(`${url} success with data %o`, data)
              return actions.nav.navigate.success({ url: action.payload.url, data: data! })
            }
          }),
          catchError(error => {
            log.nav(`nav failure with error %o`, error)
            return of(actions.nav.navigate.failure({ url, errors: [error] }))
          })
        )
      )
      // tap(action => console.log('result', action))
    )

  return { ac: actionCreator, eh: epicHandler }
}
