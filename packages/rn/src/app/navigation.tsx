import { App, AppContext } from '@ag/app'
import * as Dialogs from '@ag/app/dialogs'
import debug from 'debug'
import platform from 'native-base/dist/src/theme/variables/platform'
import React from 'react'
import {
  LayoutBottomTabs,
  LayoutBottomTabsChildren,
  LayoutRoot,
  Navigation,
} from 'react-native-navigation'
import * as Tabs from '../tabs'
import { DialogContext } from '../ui/Dialog'

const log = debug('rn:navigation')

export const setDefaultOptions = () => {
  Navigation.setDefaultOptions({
    bottomTab: {
      selectedTextColor: platform.tabBarTextColor,
      selectedIconColor: platform.tabBarActiveTextColor,
      textColor: platform.tabBarTextColor,
      iconColor: platform.tabBarTextColor,
    },
    topBar: {
      largeTitle: {
        visible: true,
      },
    },
  })
}

export const registerComponents = (RnApp: React.ComponentType) => {
  for (const tab of [
    Tabs.AccountsTab,
    Tabs.BillsTab,
    Tabs.BudgetsTab,
    Tabs.CalendarTab,
    Tabs.HomeTab,
  ]) {
    log('registered tab %s', tab.name)
    Navigation.registerComponentWithRedux(tab.name, () => tab, RnApp, undefined)
  }

  for (const Dialog of [
    Dialogs.LoginDialog, //
    Dialogs.BankDialog,
    Dialogs.AccountDialog,
  ]) {
    const component: React.FC<DialogContext> = ({ componentId, ...props }) => (
      <AppContext.Consumer>
        {appContext => (
          <DialogContext.Provider value={{ ...appContext, componentId }}>
            <Dialog {...props as any} />
          </DialogContext.Provider>
        )}
      </AppContext.Consumer>
    )
    component.displayName = `rnnDlg(${component.name})`

    log('registered dialog %s', Dialog.name)
    Navigation.registerComponentWithRedux(Dialog.name, () => component, RnApp, undefined)
  }
}

interface TabComponent {
  name: string
  stackId: string
}

const makeTab = (tab: TabComponent, passProps: AppContext): LayoutBottomTabsChildren => ({
  stack: {
    id: tab.stackId,
    children: [
      {
        component: {
          name: tab.name,
          passProps,
        },
      },
    ],
  },
})

const bottomTabs = (passProps: AppContext): LayoutBottomTabs => ({
  children: [
    makeTab(Tabs.HomeTab, passProps),
    makeTab(Tabs.AccountsTab, passProps),
    makeTab(Tabs.BillsTab, passProps),
    makeTab(Tabs.BudgetsTab, passProps),
    makeTab(Tabs.CalendarTab, passProps),
  ],
})

export const root = (passProps: AppContext): LayoutRoot => ({
  root: {
    bottomTabs: bottomTabs(passProps),
  },
})
