import { ImageUri } from '@ag/util'
import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'

export interface DialogState {
  loginDialog?: {
    isOpen: boolean
  }
  pictureDialog?: {
    isOpen: boolean
    url: string
    onSelected: (uri: ImageUri) => any
  }
  bankDialog?: {
    isOpen: boolean
    bankId?: string
  }
  accountDialog?: {
    isOpen: boolean
    bankId?: string
    accountId?: string
  }
  billDialog?: {
    isOpen: boolean
    billId?: string
  }
}

const initialState: DialogState = {}

export const dialog = (state: DialogState = initialState, action: CoreAction): DialogState => {
  switch (action.type) {
    case getType(actions.openDlg.login):
      return { ...state, loginDialog: { isOpen: true } }

    case getType(actions.openDlg.picture):
      return { ...state, pictureDialog: { isOpen: true, ...action.payload } }

    case getType(actions.openDlg.bankCreate):
      return { ...state, bankDialog: { isOpen: true } }

    case getType(actions.openDlg.bankEdit):
      return { ...state, bankDialog: { isOpen: true, ...action.payload } }

    case getType(actions.openDlg.accountCreate):
      return { ...state, accountDialog: { isOpen: true, ...action.payload } }

    case getType(actions.openDlg.accountEdit):
      return { ...state, accountDialog: { isOpen: true, ...action.payload } }

    case getType(actions.openDlg.billCreate):
      return { ...state, billDialog: { isOpen: true } }

    case getType(actions.openDlg.billEdit):
      return { ...state, billDialog: { isOpen: true, ...action.payload } }

    case getType(actions.closeDlg):
      switch (action.payload) {
        case 'login':
          return {
            ...state,
            loginDialog: state.loginDialog && { ...state.loginDialog, isOpen: false },
          }

        case 'picture':
          return {
            ...state,
            pictureDialog: state.pictureDialog && { ...state.pictureDialog, isOpen: false },
          }

        case 'account':
          return {
            ...state,
            accountDialog: state.accountDialog && { ...state.accountDialog, isOpen: false },
          }

        case 'bank':
          return {
            ...state,
            bankDialog: state.bankDialog && { ...state.bankDialog, isOpen: false },
          }

        case 'bill':
          return {
            ...state,
            billDialog: state.billDialog && { ...state.billDialog, isOpen: false },
          }

        default:
          return state
      }

    default:
      return state
  }
}
