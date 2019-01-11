import { log } from '@ag/util/log'
import { DocumentNode } from 'graphql'
import { defineMessages } from 'react-intl'
import { from, of } from 'rxjs'
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { AppEpic } from './index'

export const createRouteEpic = (url: string, query: DocumentNode): AppEpic => (
  action$,
  state$,
  { runQuery }
) =>
  action$.pipe(
    filter(isActionOf(actions.navigate.request)),
    filter(action => action.payload.url === url),
    tap(action => log.nav(`${url}, run query %O params %o`, query, action.payload.params)),
    mergeMap(action =>
      from(runQuery(query, action.payload.params)).pipe(
        map(({ data, errors }) => {
          if (errors) {
            log.nav(`${url} failure: %o`, errors)
            return actions.navigate.failure({ url: action.payload.url, errors })
          } else {
            log.nav(`${url} success with data %o`, data)
            return actions.navigate.success({ url: action.payload.url, data: data! })
          }
        }),
        catchError(error => {
          log.nav(`nav failure with error %o`, error)
          return of(actions.navigate.failure({ url, errors: [error] }))
        })
      )
    )
    // tap(action => console.log('result', action))
  )

export const errorRouteEpic: AppEpic = (action$, state$, { runQuery }) =>
  action$.pipe(
    filter(isActionOf(actions.navigate.failure)),
    tap(action => log.nav(`navigate failure to %s %o`, action.payload.url, action.payload.errors)),
    map(action =>
      actions.pushAlert({
        title: { id: messages.errorMessage, values: { url: action.payload.url } },
        body: action.payload.errors.map(err => ({
          id: messages.error,
          values: { message: err.message },
        })),
        confirmText: messages.ok,
        show: true,
      })
    )
    // tap(action => console.log('result', action))
  )

export const navEpics = [
  errorRouteEpic, //
]

const messages = defineMessages({
  ok: {
    id: 'navEpics.ok',
    defaultMesage: 'Ok',
  },
  errorMessage: {
    id: 'navEpics.errorMessage',
    defaultMessage: 'Error navigating to {url}',
  },
  error: {
    id: 'navEpics.error',
    defaultMessage: '{message}',
  },
})
