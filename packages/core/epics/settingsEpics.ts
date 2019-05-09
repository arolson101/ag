import { Setting } from '@ag/db/entities'
import { from, of } from 'rxjs'
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { selectors } from '../reducers'
import { CoreEpic } from './CoreEpic'

const settingsToRecord = (settings: Setting[]): Record<string, string> =>
  settings.reduce((obj, setting) => ({ ...obj, [setting.key]: setting.value }), {})

const dbLoginSuccessEpic: CoreEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.dbLoginSuccess)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const p = (async () => {
        const { settingsRepository } = selectors.getAppDb(state)
        const settings = await settingsRepository.all()
        return settingsToRecord(settings)
      })()

      return from(p).pipe(
        map(actions.settingsInit), //
        catchError(error => of(actions.settingsError(error)))
      )
    })
  )

const dbLogoutEpic: CoreEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.dbLogout)),
    withLatestFrom(state$),
    map(() => actions.settingsInit({}))
  )

const settingsSetValueEpic: CoreEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.settingsSetValue)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const p = (async () => {
        const { settingsRepository } = selectors.getAppDb(state)
        const { key, value } = action.payload
        await settingsRepository.set(key, value)

        const settings = await settingsRepository.all()
        return settingsToRecord(settings)
      })()

      return from(p).pipe(
        map(actions.settingsInit), //
        catchError(error => of(actions.settingsError(error)))
      )
    })
  )

export const settingsEpics = [
  dbLoginSuccessEpic, //
  dbLogoutEpic,
  settingsSetValueEpic,
]
