import { concat, of, from } from 'rxjs'
import { delay, filter, ignoreElements, mergeMap, tap, merge, mapTo, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { EpicType } from './index'

// const navAction: EpicType = (action$, state$, { logger }) =>
//   action$.pipe(
//     // tap(action => console.log('navAction got action', action)),
//     filter(isActionOf(actions.nav.login)),
//     tap(action => {
//       logger(`action type must be equal: === ${action.type}`)
//     }),
//     ignoreElements()
//   )

export const navHome = () => actions.nav.navigate.request({ url: '/home' })
const handleNavHome: EpicType = (action$, state$, { runQuery }) =>
  action$.pipe(
    filter(isActionOf(actions.nav.navigate.request)),
    filter(action => action.payload.url === '/home'),
    // tap(action => console.log('navHome got action', action)),
    mergeMap(action =>
      from(runQuery('asdf')).pipe(
        map(data => actions.nav.navigate.success({ url: action.payload.url, data }))
      )
    )
    // tap(action => console.log('result', action))
  )

// const navLogin: EpicType = (action$, state$) =>
//   action$.pipe(
//     // tap(action => console.log('navLogin got action', action)),
//     filter(isActionOf(actions.nav.home)),
//     mergeMap(action =>
//       concat(
//         //
//         of(actions.nav.loading.request()).pipe(delay(0)),
//         of(actions.nav.loading.success()).pipe(delay(1000))
//       )
//     )
//   )

export const navEpics = [
  // navAction, //
  handleNavHome,
]
