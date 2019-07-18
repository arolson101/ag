import { Store } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { StateType } from 'typesafe-actions'
import { CoreAction } from '../actions'
import { CoreDependencies } from '../context'
import { db, dbSelectors } from './dbReducer'
import { dialog } from './dialogReducer'
import { ents, entsSelectors } from './entsReducer'
import { intl, intlSelectors } from './intlReducer'
import { settings, settingsSelectors } from './settingsReducer'
import { theme, themeSelectors } from './themeReducer'

export const coreReducers = {
  db,
  dialog,
  intl,
  settings,
  ents,
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

  banks: (state: CoreState) => entsSelectors.banks(state.ents),
  getBank: (state: CoreState) => entsSelectors.getBank(state.ents),
  getAccountsForBank: (state: CoreState) => entsSelectors.getAccountsForBank(state.ents),
  getAccount: (state: CoreState) => entsSelectors.getAccount(state.ents),
  accounts: (state: CoreState) => entsSelectors.accounts(state.ents),
  getTransactions: (state: CoreState) => entsSelectors.getTransactions(state.ents),
  getTransaction: (state: CoreState) => entsSelectors.getTransaction(state.ents),
  bills: (state: CoreState) => entsSelectors.bills(state.ents),
  getBill: (state: CoreState) => entsSelectors.getBill(state.ents),
  getImage: (state: CoreState) => entsSelectors.getImage(state.ents),

  themeMode: (state: CoreState) => themeSelectors.themeMode(state.theme),
  themeColor: (state: CoreState) => themeSelectors.themeColor(state.theme),
  platform: (state: CoreState) => themeSelectors.platform(state.theme),
}
