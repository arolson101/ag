import { getType } from 'typesafe-actions'
import { actions, AppAction } from '../actions'

export interface DialogState {
  bankDialog?: {
    isOpen: boolean
    bankId?: string
  }
  accountDialog?: {
    isOpen: boolean
    bankId: string
    accountId?: string
  }
}

const initialState: DialogState = {}

export const dialog = (state: DialogState = initialState, action: AppAction): DialogState => {
  switch (action.type) {
    case getType(actions.dlg.bankCreate):
      return { ...state, bankDialog: { isOpen: true } }

    case getType(actions.dlg.bankEdit):
      return { ...state, bankDialog: { isOpen: true, ...action.payload } }

    case getType(actions.dlg.accountCreate):
      return { ...state, accountDialog: { isOpen: true, ...action.payload } }

    case getType(actions.dlg.accountEdit):
      return { ...state, accountDialog: { isOpen: true, ...action.payload } }

    case getType(actions.dlg.close):
      return {
        ...state,
        bankDialog: state.bankDialog && { ...state.bankDialog, isOpen: false },
        accountDialog: state.accountDialog && { ...state.accountDialog, isOpen: false },
      }

    default:
      return state
  }
}
