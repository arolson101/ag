import { AccountDialog, BankDialog, LoginDialog } from '@ag/app'
import assert from 'assert'
import debug from 'debug'
import { EventSubscription, Layout, Navigation } from 'react-native-navigation'
import { RnStore } from '../reducers'

const log = debug('rn:storeNavigation')

const dialogComponentIds: Record<string, string | undefined> = {}

const showModal = async <T>(component: React.ComponentType<T>, passProps: T) => {
  assert(dialogComponentIds[component.name] === undefined)

  const componentId = `id-${component.name}`
  Navigation.showModal({
    stack: {
      id: componentId,
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

  dialogComponentIds[component.name] = componentId
  log('showModal %s => %s', component.name, componentId)
}

const hideModal = (component: React.ComponentType<any>) => {
  const componentId = dialogComponentIds[component.name]
  if (componentId) {
    assert(componentId)
    log('hideModal %s => %s', component.name, componentId)
    Navigation.dismissModal(componentId)
    dialogComponentIds[component.name] = undefined
  } else {
    log('hideModal %s - componentId not found', component.name)
  }
}

Navigation.events().registerModalDismissedListener(({ componentId }) => {
  for (const name of Object.keys(dialogComponentIds)) {
    if (dialogComponentIds[name] === componentId) {
      log('registerModalDismissedListener %s => %s', componentId, name)
      dialogComponentIds[name] = undefined
      return
    }
  }

  log('registerModalDismissedListener %s - componentId not found', componentId)
})

const updateModal = <T>(component: React.ComponentType<T>, show: T | boolean | undefined) => {
  const isOpen = dialogComponentIds[component.name] !== undefined
  if (!!show !== isOpen) {
    if (show) {
      showModal(component, show as T)
    } else {
      hideModal(component)
    }
  }
}

export const syncNavState = (store: RnStore) => {
  store.subscribe(() => {
    const dialog = store.getState().dialog
    updateModal(LoginDialog, dialog.login)
    updateModal(BankDialog, dialog.bankDialog)
    updateModal(AccountDialog, dialog.accountDialog)
  })
}
