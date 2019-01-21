import { Store } from 'redux'
import { StateType } from 'typesafe-actions'
import { AppAction } from '../actions'
import { db, dbSelectors } from './db'
import { dialog } from './dialog'

export const appReducers = {
  dialog,
  db,
}

export interface AppState extends StateType<typeof appReducers> {}
export interface AppStore extends Store<AppState, AppAction> {}

export const selectors = {
  getDbs: (state: AppState) => dbSelectors.getDbs(state.db),
  getAppDb: (state: AppState) => dbSelectors.getAppDb(state.db),
  getAppDbOrFail: (state: AppState) => dbSelectors.getAppDbOrFail(state.db),
  getBanks: (state: AppState) => dbSelectors.getBanks(state.db),
  getAccounts: (state: AppState) => dbSelectors.getAccounts(state.db),
  getTransactions: (state: AppState) => dbSelectors.getTransactions(state.db),
}
