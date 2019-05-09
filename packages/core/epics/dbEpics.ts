import { Account, Bank, Bill, Budget, Category, Db, Setting, Transaction } from '@ag/db/entities'
import crypto from 'crypto'
import { from, of } from 'rxjs'
import {
  catchError,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators'
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

const initEpic: CoreEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.init)),
    mapTo(actions.dbInit.request())
  )

const dbInitEpic: CoreEpic = (action$, state$, { sys: { openDb } }) =>
  action$.pipe(
    filter(isActionOf(actions.dbInit.request)),
    switchMap(action => {
      const p = (async () => {
        const connection = await openDb('index', '', indexEntities)
        const dbRepo = connection.getRepository(Db)
        const dbs: DbInfo[] = await dbRepo.find()
        return { connection, dbs }
      })()

      return from(p).pipe(
        mergeMap(res => [
          actions.dbInit.success(res), //
          actions.openDlg.login(),
        ]),
        catchError(error => of(actions.dbInit.failure(error)))
      )
    })
  )

const dbCreateEpic: CoreEpic = (action$, state$, { sys: { openDb } }) =>
  action$.pipe(
    filter(isActionOf(actions.dbCreate.request)),
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

        const dbs: DbInfo[] = await dbRepo.find()

        return { connection, dbs }
      })()

      return from(p).pipe(
        mergeMap(res => [
          actions.dbCreate.success(res), //
          actions.closeDlg('login'),
        ]),
        catchError(error => of(actions.dbCreate.failure(error)))
      )
    })
  )

const dbOpenEpic: CoreEpic = (action$, state$, { sys: { openDb } }) =>
  action$.pipe(
    filter(isActionOf(actions.dbLogin.request)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const { dbId, password } = action.payload
      const dbRepo = selectors.getDbRepository(state)

      const p = (async () => {
        const dbInfo = await dbRepo.findOneOrFail(dbId)
        const key = dbInfo.getKey(password)

        const connection = await openDb(dbInfo.path, key, appEntities)
        return { connection }
      })()

      return from(p).pipe(
        mergeMap(res => [
          actions.dbLogin.success(res), //
          actions.closeDlg('login'),
        ]),
        catchError(error => of(actions.dbLogin.failure(error)))
      )
    })
  )

const dbDeleteEpic: CoreEpic = (action$, state$, { sys: { deleteDb } }) =>
  action$.pipe(
    filter(isActionOf(actions.dbDelete.request)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const { dbId } = action.payload
      const dbRepo = selectors.getDbRepository(state)

      const p = (async () => {
        const dbInfo = await dbRepo.findOneOrFail(dbId)
        await deleteDb(dbInfo.path)

        await dbRepo
          .createQueryBuilder()
          .delete()
          .from(Db)
          .where('dbId = :dbId', { dbId })
          .execute()

        const dbs: DbInfo[] = await dbRepo.find()

        return { dbs }
      })()

      return from(p).pipe(
        mergeMap(res => [
          actions.dbDelete.success(res), //
        ]),
        catchError(error => of(actions.dbDelete.failure(error)))
      )
    })
  )

export const dbEpics = [
  initEpic, //
  dbInitEpic,
  dbCreateEpic,
  dbOpenEpic,
  dbDeleteEpic,
]
