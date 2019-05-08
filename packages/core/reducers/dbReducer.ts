import { Connection } from 'typeorm'
import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'

export interface DbState {
  index?: Connection
  app?: Connection
}

const defaultState: DbState = {}

export const connectionReducer = (state: DbState = defaultState, action: CoreAction) => {
  switch (action.type) {
    case getType(actions.setIndexConnection):
      return { ...state, ...action.payload }

    case getType(actions.setAppConnection):
      return { ...state, ...action.payload }

    default:
      return state
  }
}
