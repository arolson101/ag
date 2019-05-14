import { Account, Bank, Bill, Budget, Category, Db, Setting, Transaction } from '@ag/db/entities'
import crypto from 'crypto'
import { defineMessages } from 'react-intl'
import { from, of } from 'rxjs'
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators'
import sanitize from 'sanitize-filename'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { selectors } from '../reducers'
import { CoreEpic } from './CoreEpic'

const indexEntities = [
  Db, //
]

const appEntities = [
  Account, //
  Bank,
  Bill,
  Budget,
  Category,
  Transaction,
  Setting,
]

const initEpic: CoreEpic = (action$, state$, { sys: { openDb } }) =>
  action$.pipe(
    filter(isActionOf(actions.init)),
    switchMap(action => {
      const p = (async () => {
        const connection = await openDb('index', '', indexEntities)
        const dbRepo = connection.getRepository(Db)
        const dbs: DbInfo[] = await dbRepo.find()
        return { connection, dbs }
      })()

      return from(p).pipe(
        mergeMap(res => [
          actions.dbSetIndex(res.connection), //
          actions.dbSetInfos(res.dbs),
          actions.openDlg.login(),
        ]),
        catchError(error => of(actions.dbInitFailure(error)))
      )
    })
  )

const dbCreateEpic: CoreEpic = (action$, state$, { sys: { openDb } }) =>
  action$.pipe(
    filter(isActionOf(actions.dbCreate)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const { name, password } = action.payload
      const dbRepo = selectors.getDbRepository(state)

      const p = (async () => {
        const dbInfo = new Db()
        dbInfo.dbId = crypto.randomBytes(8).toString('base64')
        dbInfo.name = name
        dbInfo.path = sanitize(name)
        const key = Db.generateKey()
        dbInfo.setPassword(key, password)

        const connection = await openDb(dbInfo.path, key, appEntities)
        await dbRepo.save(dbInfo)

        const dbs = await dbRepo.all()

        return { connection, dbs }
      })()

      return from(p).pipe(
        mergeMap(res => [
          actions.dbLoginSuccess(res.connection), //
          actions.dbSetInfos(res.dbs),
          actions.closeDlg('login'),
        ]),
        catchError(error => of(actions.dbLoginFailure(error)))
      )
    })
  )

const dbOpenEpic: CoreEpic = (action$, state$, { sys: { openDb } }) =>
  action$.pipe(
    filter(isActionOf(actions.dbOpen)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const { dbId, password } = action.payload
      const dbRepo = selectors.getDbRepository(state)

      const p = (async () => {
        const dbInfo = await dbRepo.get(dbId)
        const key = dbInfo.getKey(password)

        const connection = await openDb(dbInfo.path, key, appEntities)
        return connection
      })()

      return from(p).pipe(
        mergeMap(res => [
          actions.dbLoginSuccess(res), //
          actions.closeDlg('login'),
        ]),
        catchError(error => of(actions.dbLoginFailure(error)))
      )
    })
  )

const dbDeleteEpic: CoreEpic = (action$, state$, { ui: { alert, showToast }, sys: { deleteDb } }) =>
  action$.pipe(
    filter(isActionOf(actions.deleteDb)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const { dbId } = action.payload
      const dbRepo = selectors.getDbRepository(state)
      const intl = selectors.getIntl(state)

      const prompt = () =>
        new Promise<boolean>((resolve, reject) => {
          alert({
            title: intl.formatMessage(messages.title),
            body: intl.formatMessage(messages.body),
            danger: true,

            confirmText: intl.formatMessage(messages.delete),
            onConfirm: () => resolve(true),

            cancelText: intl.formatMessage(messages.cancel),
            onCancel: () => resolve(false),
          })
        })

      const p = (async (): Promise<DbInfo[] | undefined> => {
        const confirmed = await prompt()

        if (confirmed) {
          const dbInfo = await dbRepo.get(dbId)
          await deleteDb(dbInfo.path)
          await dbRepo.deleteDb(dbId)

          showToast(intl.formatMessage(messages.deleted), true)

          const dbs = await dbRepo.all()
          return dbs
        }
      })()

      return from(p).pipe(
        filter((res): res is DbInfo[] => !!res),
        map(res => actions.dbSetInfos(res)) //
      )
    })
  )

export const dbEpics = [
  initEpic, //
  dbCreateEpic,
  dbOpenEpic,
  dbDeleteEpic,
]

const messages = defineMessages({
  title: {
    id: 'dbEpics.title',
    defaultMessage: 'Are you sure?',
  },
  body: {
    id: 'dbEpics.body',
    defaultMessage: 'This will all your data.  This action cannot be undone.',
  },
  delete: {
    id: 'dbEpics.delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'dbEpics.cancel',
    defaultMessage: 'Cancel',
  },
  deleted: {
    id: 'dbEpics.deleted',
    defaultMessage: 'Data deleted',
  },
})
