import {
  Account,
  appEntities,
  Bank,
  Bill,
  Budget,
  Category,
  Db,
  indexEntities,
} from '@ag/db/entities'
import crypto from 'crypto'
import { defineMessages } from 'react-intl'
import sanitize from 'sanitize-filename'
import { actions } from '../actions'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'
import { settingsThunks } from './settingsThunks'

const dbInit = (): CoreThunk =>
  async function _dbInit(dispatch, getState, { sys: { openDb } }) {
    try {
      dispatch(actions.dbInit.request())
      const connection = await openDb('index', '', indexEntities)
      const dbRepo = connection.getRepository(Db)
      const dbs: DbInfo[] = await dbRepo.find()

      dispatch(actions.dbSetInfos(dbs))
      dispatch(actions.dbInit.success(connection))
      dispatch(actions.openDlg.login())
    } catch (error) {
      dispatch(actions.dbInit.failure(error))
    }
  }

const dbLoadEntities = (): CoreThunk =>
  async function _dbLoadEntities(dispatch, getState) {
    const {
      accountsRepository, //
      banksRepository,
      billsRepository,
      // budgetsRepository,
      // categoriesRepository,
    } = selectors.appDb(getState())

    const banks = await banksRepository.all()
    const accounts = await accountsRepository.all()
    const bills = await billsRepository.all()
    // const budgets = await budgetsRepository.all()
    // const categories = await categoriesRepository.all()

    dispatch(
      actions.dbEntities([
        { table: Bank, entities: banks, deletes: [] },
        { table: Account, entities: accounts, deletes: [] },
        // { table: Transaction, entities: transactions, deletes: [] },
        { table: Bill, entities: bills, deletes: [] },
        // { table: Budget, entities: budgets, deletes: [] },
        // { table: Category, entities: categories, deletes: [] },
      ])
    )
  }

const dbReloadAll = (): CoreThunk =>
  async function _dbReloadAll(dispatch, getState) {
    dispatch(dbLoadEntities())
  }

const dbPostLogin = (): CoreThunk =>
  async function _dbLoginSuccess(dispatch) {
    await dispatch(settingsThunks.settingsInit())
    await dispatch(dbLoadEntities())
    await dispatch(actions.closeDlg('login'))
  }

const dbCreate = ({ name, password }: { name: string; password: string }): CoreThunk =>
  async function _dbCreate(dispatch, getState, { sys: { openDb } }) {
    try {
      dispatch(actions.dbLogin.request())
      const dbRepo = selectors.dbRepository(getState())

      const dbInfo = new Db()
      dbInfo.dbId = crypto.randomBytes(8).toString('base64')
      dbInfo.name = name
      dbInfo.path = sanitize(name)
      const key = Db.generateKey()
      dbInfo.setPassword(key, password)

      const connection = await openDb(dbInfo.path, key, appEntities)
      await dbRepo.save(dbInfo)

      const dbs: DbInfo[] = await dbRepo.find()

      await dispatch(actions.dbSetInfos(dbs))
      await dispatch(actions.dbLogin.success(connection))
      await dispatch(dbPostLogin())
    } catch (error) {
      dispatch(actions.dbLogin.failure(error))
    }
  }

const dbOpen = ({ dbId, password }: { dbId: string; password: string }): CoreThunk =>
  async function _dbOpen(dispatch, getState, { sys: { openDb } }) {
    try {
      dispatch(actions.dbLogin.request())
      const dbRepo = selectors.dbRepository(getState())

      const dbInfo = await dbRepo.findOneOrFail(dbId)
      const key = dbInfo.getKey(password)

      const connection = await openDb(dbInfo.path, key, appEntities)

      await dispatch(actions.dbLogin.success(connection))
      await dispatch(dbPostLogin())
    } catch (error) {
      dispatch(actions.dbLogin.failure(error))
    }
  }

const dbDelete = ({ dbId }: { dbId: string }): CoreThunk =>
  async function _dbDelete(dispatch, getState, { sys: { deleteDb }, ui: { alert, showToast } }) {
    const intl = selectors.intl(getState())

    const confirmed = await alert({
      title: intl.formatMessage(messages.dlgTitle),
      body: intl.formatMessage(messages.dlgBody),
      danger: true,

      confirmText: intl.formatMessage(messages.dlgDelete),
      cancelText: intl.formatMessage(messages.dlgCancel),
    })

    if (!confirmed) {
      return
    }

    try {
      dispatch(actions.dbDelete.request())
      const dbRepo = selectors.dbRepository(getState())

      const dbInfo = await dbRepo.findOneOrFail(dbId)
      await deleteDb(dbInfo.path)

      await dbRepo
        .createQueryBuilder()
        .delete()
        .from(Db)
        .where('dbId = :dbId', { dbId })
        .execute()

      const dbs: DbInfo[] = await dbRepo.find()
      await dispatch(actions.dbSetInfos(dbs))
      await dispatch(actions.dbDelete.success())
      showToast(intl.formatMessage(messages.dlgDeleted), true)
    } catch (error) {
      dispatch(actions.dbDelete.failure(error))
    }
  }

export const dbThunks = {
  dbInit,
  dbReloadAll,
  dbCreate,
  dbOpen,
  dbDelete,
}

const messages = defineMessages({
  title: {
    id: 'dbThunks.title',
    defaultMessage: 'Ag',
  },
  create: {
    id: 'dbThunks.create',
    defaultMessage: 'Create',
  },
  open: {
    id: 'dbThunks.open',
    defaultMessage: 'Open',
  },
  delete: {
    id: 'dbThunks.delete',
    defaultMessage: 'Delete',
  },
  dlgTitle: {
    id: 'dbThunks.dlgTitle',
    defaultMessage: 'Are you sure?',
  },
  dlgBody: {
    id: 'dbThunks.dlgBody',
    defaultMessage: 'This will all your data.  This action cannot be undone.',
  },
  dlgDelete: {
    id: 'dbThunks.dlgDelete',
    defaultMessage: 'Delete',
  },
  dlgCancel: {
    id: 'dbThunks.dlgCancel',
    defaultMessage: 'Cancel',
  },
  dlgDeleted: {
    id: 'dbThunks.dlgDeleted',
    defaultMessage: 'Data deleted',
  },
})
