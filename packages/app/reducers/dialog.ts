import { getType } from 'typesafe-actions'
import { actions, AlertConfig, AppAction } from '../actions'

const initialState: AlertConfig[] = []

type DialogState = typeof initialState

export const dialog = (state: DialogState = initialState, action: AppAction): DialogState => {
  switch (action.type) {
    case getType(actions.pushAlert):
      return [...state, action.payload]

    case getType(actions.dismissAlert):
      return [
        ...state.slice(0, -1), //
        { ...state[state.length - 1], show: false },
      ]

    case getType(actions.popAlert):
      return state.slice(0, -1)

    default:
      return state
  }
}
