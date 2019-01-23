import { getType } from 'typesafe-actions'
import { actions, AppAction } from '../actions'

export interface DialogState {
  bankCreate?: {
    isOpen: boolean
  }
  bankEdit?: {
    isOpen: boolean
    bankId: string
  }
}

const initialState: DialogState = {}

export const dialog = (state: DialogState = initialState, action: AppAction): DialogState => {
  switch (action.type) {
    case getType(actions.dlg.bankCreate):
      return { ...state, bankCreate: { isOpen: true } }

    case getType(actions.dlg.bankEdit):
      return { ...state, bankEdit: { isOpen: true, ...action.payload } }

    case getType(actions.dlg.close):
      return {
        ...state,
        bankCreate: { ...state.bankCreate, isOpen: false },
        bankEdit: state.bankEdit && { ...state.bankEdit, isOpen: false },
      }

    default:
      return state
  }
}
