import { Store } from 'redux'
import { StateType } from 'typesafe-actions'
import { CoreAction } from '../actions'
import { dialog } from './dialogReducer'

export const appReducers = {
  dialog,
}

export interface CoreState extends StateType<typeof appReducers> {}
export interface CoreStore extends Store<CoreState, CoreAction> {}

export const selectors = {}
