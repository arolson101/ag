import { Store } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { StateType } from 'typesafe-actions'
import { CoreAction } from '../actions'
import { CoreDependencies } from '../context'
import { db, dbSelectors } from './dbReducer'
import { dialog } from './dialogReducer'
import { intl, intlSelectors } from './intlReducer'
import { records, recordsSelectors } from './recordsReducer'
import { settings, settingsSelectors } from './settingsReducer'
import { theme, themeSelectors } from './themeReducer'

export const coreReducers = {
  db,
  dialog,
  intl,
  settings,
  records,
  theme,
}

export interface CoreState extends StateType<typeof coreReducers> {}
export interface CoreStore extends Store<CoreState, CoreAction> {
  dispatch: ThunkDispatch<CoreState, CoreDependencies, CoreAction>
}

export const selectors = {
  isDbInitializing: (state: CoreState) => dbSelectors.isDbInitializing(state.db),
  isDbInitialized: (state: CoreState) => dbSelectors.isDbInitialized(state.db),
  getIndexDb: (state: CoreState) => dbSelectors.getIndexDb(state.db),
  getDbs: (state: CoreState) => dbSelectors.getDbs(state.db),
  getDbRepository: (state: CoreState) => dbSelectors.getDbRepository(state.db),
  getIndexError: (state: CoreState) => dbSelectors.getIndexError(state.db),
  isLoggedIn: (state: CoreState) => dbSelectors.isLoggedIn(state.db),
  getAppDb: (state: CoreState) => dbSelectors.getAppDb(state.db),
  getConnection: (state: CoreState) => dbSelectors.getConnection(state.db),
  getAppError: (state: CoreState) => dbSelectors.getAppError(state.db),
  getSettingsRepository: (state: CoreState) => dbSelectors.getSettingsRepository(state.db),

  getDialogs: (state: CoreState) => state.dialog,
  getIntl: (state: CoreState) => intlSelectors.getIntl(state.intl),

  getSettingsError: (state: CoreState) => settingsSelectors.getSettingsError(state.settings),
  getSetting: (state: CoreState) => settingsSelectors.getSetting(state.settings),

  getBanks: (state: CoreState) => recordsSelectors.getBanks(state.records),
  getBank: (state: CoreState) => (bankId?: string) =>
    recordsSelectors.getBank(state.records, bankId),
  getAccountsForBank: (state: CoreState) => (bankId: string) =>
    recordsSelectors.getAccountsForBank(state.records, bankId),
  getAccount: (state: CoreState) => (accountId?: string) =>
    recordsSelectors.getAccount(state.records, accountId),
  getAccounts: (state: CoreState) => recordsSelectors.getAccounts(state.records),
  getTransactions: (state: CoreState) => (accountId: string) =>
    recordsSelectors.getTransactions(state.records, accountId),
  getTransaction: (state: CoreState) => (transactionId?: string) =>
    recordsSelectors.getTransaction(state.records, transactionId),

  getThemeMode: (state: CoreState) => themeSelectors.getThemeMode(state.theme),
  getThemeColor: (state: CoreState) => themeSelectors.getThemeColor(state.theme),
  getPlatform: (state: CoreState) => themeSelectors.getPlatform(state.theme),
}
