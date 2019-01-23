import { getType } from 'typesafe-actions'
import { actions, AppAction } from '../actions'

interface DialogState {
  action: AppAction | undefined
}

const initialState: DialogState = { action: undefined }

export const dialog = (state: DialogState = initialState, action: AppAction): DialogState => {
  switch (action.type) {
    case getType(actions.dlg.bankCreate):
    case getType(actions.dlg.bankEdit):
      return { ...state, action }

    case getType(actions.dlg.close):
      return { ...state, action: undefined }

    default:
      return state
  }
}
