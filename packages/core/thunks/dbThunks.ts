import { appEntities, Db, indexEntities } from '@ag/db/entities'
import crypto from 'crypto'
import sanitize from 'sanitize-filename'
import { Connection } from 'typeorm'
import { actions } from '../actions'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'
import { settingsThunks } from './settingsThunks'

const dbInit = (): CoreThunk =>
  async function _dbInit(dispatch, getState, { sys: { openDb } }) {
    try {
      const connection = await openDb('index', '', indexEntities)
      const dbRepo = connection.getRepository(Db)
      const dbs: DbInfo[] = await dbRepo.find()

      dispatch(actions.dbSetIndex(connection))
      dispatch(actions.dbSetInfos(dbs))
    } catch (error) {
      dispatch(actions.dbInitFailure(error))
    }
  }

const dbLogin = (connection: Connection): CoreThunk =>
  async function _dbLogin(dispatch, getState) {
    dispatch(actions.dbLoginSuccess(connection))
    dispatch(settingsThunks.settingsInit(connection))
  }

const dbCreate = ({ name, password }: { name: string; password: string }): CoreThunk =>
  async function _dbCreate(dispatch, getState, { sys: { openDb } }) {
    try {
      const dbRepo = selectors.getDbRepository(getState())

      const dbInfo = new Db()
      dbInfo.dbId = crypto.randomBytes(8).toString('base64')
      dbInfo.name = name
      dbInfo.path = sanitize(name)
      const key = Db.generateKey()
      dbInfo.setPassword(key, password)

      const connection = await openDb(dbInfo.path, key, appEntities)
      await dbRepo.save(dbInfo)

      const dbs: DbInfo[] = await dbRepo.find()

      dispatch(actions.dbSetInfos(dbs))
      return dispatch(dbLogin(connection))
    } catch (error) {
      dispatch(actions.dbLoginFailure(error))
    }
  }

const dbOpen = ({ dbId, password }: { dbId: string; password: string }): CoreThunk =>
  async function _dbOpen(dispatch, getState, { sys: { openDb } }) {
    try {
      const dbRepo = selectors.getDbRepository(getState())

      const dbInfo = await dbRepo.findOneOrFail(dbId)
      const key = dbInfo.getKey(password)

      const connection = await openDb(dbInfo.path, key, appEntities)

      return dispatch(dbLogin(connection))
    } catch (error) {
      dispatch(actions.dbLoginFailure(error))
    }
  }

const dbDelete = ({ dbId }: { dbId: string }): CoreThunk<boolean> =>
  async function _dbDelete(dispatch, getState, { sys: { deleteDb } }) {
    try {
      const dbRepo = selectors.getDbRepository(getState())

      const dbInfo = await dbRepo.findOneOrFail(dbId)
      await deleteDb(dbInfo.path)

      await dbRepo
        .createQueryBuilder()
        .delete()
        .from(Db)
        .where('dbId = :dbId', { dbId })
        .execute()

      const dbs: DbInfo[] = await dbRepo.find()

      dispatch(actions.dbSetInfos(dbs))
      return true
    } catch (error) {
      dispatch(actions.dbLoginFailure(error))
      return false
    }
  }

export const dbThunks = {
  dbInit,
  dbCreate,
  dbOpen,
  dbDelete,
}
