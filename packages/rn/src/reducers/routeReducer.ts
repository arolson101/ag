import { actions, AppAction } from '@ag/app'
import * as Dialogs from '@ag/app/dialogs'
import debug from 'debug'
import { Navigation } from 'react-native-navigation'
import { getType } from 'typesafe-actions'

const log = debug('rn:routeReducer')

export interface RouterState {
  // stack: string[]
}

const initialState: RouterState = {
  // stack: [],
}

const showModal = <T>(component: React.ComponentType<T>, passProps: T) =>
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: component.name,
            passProps,
          },
        },
      ],
    },
  })

export const router = (state: RouterState = initialState, action: AppAction): RouterState => {
  switch (action.type) {
    // case getType(actions.dlg.mounted):
    //   return { ...state, stack: [...state.stack, action.payload.componentId] }

    // case getType(actions.dlg.unmounted):
    //   return { ...state, stack: state.stack.filter(id => id !== action.payload.componentId) }

    case getType(actions.openApp):
      // state.stack.forEach(componentId => Navigation.dismissModal(componentId))
      Navigation.dismissAllModals()
      break

    case getType(actions.dlg.close):
      Navigation.dismissAllModals()
      break

    case getType(actions.dlg.login):
      showModal(Dialogs.LoginDialog, { isOpen: true })
      break

    case getType(actions.dlg.accountCreate):
      showModal(Dialogs.AccountDialog, { ...action.payload, isOpen: true })
      break

    case getType(actions.dlg.accountEdit):
      showModal(Dialogs.AccountDialog, { ...action.payload, isOpen: true })
      break

    case getType(actions.dlg.bankCreate):
      showModal(Dialogs.BankDialog, { isOpen: true })
      break

    case getType(actions.dlg.bankEdit):
      showModal(Dialogs.BankDialog, { ...action.payload, isOpen: true })
      break
  }
  return state
}
