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
  indexDb: (state: CoreState) => dbSelectors.indexDb(state.db),
  dbs: (state: CoreState) => dbSelectors.dbs(state.db),
  dbRepository: (state: CoreState) => dbSelectors.dbRepository(state.db),
  indexError: (state: CoreState) => dbSelectors.indexError(state.db),
  isLoggedIn: (state: CoreState) => dbSelectors.isLoggedIn(state.db),
  appDb: (state: CoreState) => dbSelectors.appDb(state.db),
  connection: (state: CoreState) => dbSelectors.connection(state.db),
  appError: (state: CoreState) => dbSelectors.appError(state.db),
  settingsRepository: (state: CoreState) => dbSelectors.settingsRepository(state.db),

  dialogs: (state: CoreState) => state.dialog,
  intl: (state: CoreState) => intlSelectors.intl(state.intl),
  locale: (state: CoreState) => intlSelectors.locale(state.intl),
  currency: (state: CoreState) => intlSelectors.currency(state.intl),

  settingsError: (state: CoreState) => settingsSelectors.settingsError(state.settings),
  getSetting: (state: CoreState) => settingsSelectors.getSetting(state.settings),

  banks: (state: CoreState) => recordsSelectors.banks(state.records),
  getBank: (state: CoreState) => recordsSelectors.getBank(state.records),
  getAccountsForBank: (state: CoreState) => recordsSelectors.getAccountsForBank(state.records),
  getAccount: (state: CoreState) => recordsSelectors.getAccount(state.records),
  accounts: (state: CoreState) => recordsSelectors.accounts(state.records),
  getTransactions: (state: CoreState) => recordsSelectors.getTransactions(state.records),
  getTransaction: (state: CoreState) => recordsSelectors.getTransaction(state.records),
  bills: (state: CoreState) => recordsSelectors.bills(state.records),
  getBill: (state: CoreState) => recordsSelectors.getBill(state.records),

  themeMode: (state: CoreState) => themeSelectors.themeMode(state.theme),
  themeColor: (state: CoreState) => themeSelectors.themeColor(state.theme),
  platform: (state: CoreState) => themeSelectors.platform(state.theme),
}
