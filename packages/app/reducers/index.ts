import { Store } from 'redux'
import { StateType } from 'typesafe-actions'
import { AppAction } from '../actions'
import { dialog } from './dialog'

export const appReducers = {
  dialog,
}

export interface AppState extends StateType<typeof appReducers> {}
export interface AppStore extends Store<AppState, AppAction> {}

export const selectors = {}
