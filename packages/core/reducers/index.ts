import { Store } from 'redux'
import { StateType } from 'typesafe-actions'
import { CoreAction } from '../actions'
import { db, dbSelectors } from './dbReducer'
import { dialog } from './dialogReducer'
import { intl, intlSelectors } from './intlReducer'

export const appReducers = {
  db,
  dialog,
  intl,
}

export interface CoreState extends StateType<typeof appReducers> {}
export interface CoreStore extends Store<CoreState, CoreAction> {}

export const selectors = {
  isDbInitializing: (state: CoreState) => dbSelectors.isDbInitializing(state.db),
  isDbInitialized: (state: CoreState) => dbSelectors.isDbInitialized(state.db),
  getIndexDb: (state: CoreState) => dbSelectors.getIndexDb(state.db),
  getDbs: (state: CoreState) => dbSelectors.getDbs(state.db),
  getDbRepository: (state: CoreState) => dbSelectors.getDbRepository(state.db),
  getIndexError: (state: CoreState) => dbSelectors.getIndexError(state.db),
  isLoggedIn: (state: CoreState) => dbSelectors.isLoggedIn(state.db),
  getAppDb: (state: CoreState) => dbSelectors.getAppDb(state.db),
  getAppError: (state: CoreState) => dbSelectors.getAppError(state.db),
  getSettingsRepository: (state: CoreState) => dbSelectors.getSettingsRepository(state.db),

  getDialogs: (state: CoreState) => state.dialog,

  getIntl: (state: CoreState) => intlSelectors.getIntl(state.intl),
}
