import {
  Account,
  appEntities,
  Bank,
  Bill,
  Db,
  Image,
  indexEntities,
  Transaction,
} from '@ag/db/entities'
import crypto from 'crypto'
import debug from 'debug'
import { defineMessages } from 'react-intl'
import sanitize from 'sanitize-filename'
import { actions } from '../actions'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'
import { settingsThunks } from './settingsThunks'

const log = debug('core:dbThunks')

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
      accountRepository, //
      bankRepository,
      billRepository,
      imageRepository,
      // budgetsRepository,
      // categoriesRepository,
    } = selectors.appDb(getState())

    const banks = await bankRepository.all()
    const accounts = await accountRepository.all()
    const bills = await billRepository.all()
    const images = await imageRepository.all()
    // const budgets = await budgetRepository.all()
    // const categories = await categoryRepository.all()

    dispatch(
      actions.dbEntities([
        { table: 'bank', entities: banks, deletes: [] },
        { table: 'account', entities: accounts, deletes: [] },
        // { table: 'transaction', entities: transactions, deletes: [] },
        { table: 'bill', entities: bills, deletes: [] },
        // { table: 'budget', entities: budgets, deletes: [] },
        // { table: 'category', entities: categories, deletes: [] },
        { table: 'image', entities: images, deletes: [] },
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

const dbClose = (): CoreThunk =>
  async function _dbClose(dispatch, getState) {
    if (selectors.isLoggedIn(getState())) {
      const { connection } = selectors.appDb(getState())
      await connection.close()
      dispatch(actions.dbLogout())
      dispatch(actions.openDlg.login())
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

const dbLoadImage = ({ imageId }: { imageId: string }): CoreThunk =>
  async function _dbLoadImage(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const { imageRepository } = selectors.appDb(state)
    const image = await imageRepository.loadFullImage(imageId)
    dispatch(actions.imageLoaded({ image }))
  }

const dbLoadTransactions = ({ accountId }: { accountId: string }): CoreThunk =>
  async function _dbloadTransactions(dispatch, getState) {
    const state = getState()
    const { transactionRepository } = selectors.appDb(state)
    const transactions = await transactionRepository.getForAccount(accountId)
    // log('dbLoadTransactions %o', transactions)
    dispatch(actions.dbEntities([{ table: 'transaction', entities: transactions, deletes: [] }]))
  }

export const dbThunks = {
  dbInit,
  dbReloadAll,
  dbCreate,
  dbOpen,
  dbClose,
  dbDelete,
  dbLoadImage,
  dbLoadTransactions,
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
