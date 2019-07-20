import { AccountDialog, BankDialog, BillDialog, LoginDialog, PictureDialog } from '@ag/core/dialogs'
import assert from 'assert'
import debug from 'debug'
import { Navigation } from 'react-native-navigation'
import { RnStore } from '../reducers'

const log = debug('rn:syncNavState')

const dialogComponentIds: Record<string, string | undefined> = {}

const showModal = async <T>(component: React.ComponentType<T>, passProps: T) => {
  if (dialogComponentIds[component.name] !== undefined) {
    return
  }

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

interface DlgProp {
  isOpen: boolean
}

const updateModal = <T extends DlgProp>(component: React.ComponentType<T>, props?: T) => {
  const show = props && props.isOpen
  const isOpen = dialogComponentIds[component.name] !== undefined
  if (show !== isOpen) {
    if (show) {
      showModal(component, props!)
    } else {
      hideModal(component)
    }
  }
}

export const syncNavState = (store: RnStore) => {
  store.subscribe(() => {
    const dialog = store.getState().dialog
    updateModal(LoginDialog, dialog.loginDialog)
    updateModal(PictureDialog, dialog.pictureDialog)
    updateModal(BankDialog, dialog.bankDialog)
    updateModal(AccountDialog, dialog.accountDialog)
    updateModal(BillDialog, dialog.billDialog)
  })
}
