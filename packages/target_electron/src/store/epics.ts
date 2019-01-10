import { actions, AppEpic, appEpics } from '@ag/app'
import { push } from 'connected-react-router'
import { filter, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

const routerEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    tap(() => console.log('routerEpic')),
    filter(isActionOf(actions.nav.navigate.success)),
    map(action => push(action.payload.url, action.payload.data) as any)
  )

export const epics: AppEpic[] = [
  ...appEpics, //
  routerEpic,
]
