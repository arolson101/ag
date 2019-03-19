import { appDialogs, CoreContext } from '@ag/core'
import { platform } from '@ag/ui-nativebase'
import debug from 'debug'
import React from 'react'
import { Platform } from 'react-native'
import {
  LayoutBottomTabs,
  LayoutBottomTabsChildren,
  LayoutRoot,
  Navigation,
} from 'react-native-navigation'
import * as Tabs from '../tabs'
import { DialogContext } from '../ui/Dialog.native'

const log = debug('rn:navigation')

export const setDefaultOptions = () => {
  Navigation.setDefaultOptions({
    bottomTabs: {
      backgroundColor: Platform.select({ android: platform.tabActiveBgColor, default: undefined }),
      titleDisplayMode: 'alwaysShow',
      // translucent: true,
      // drawBehind: true,
    },
    bottomTab: {
      selectedTextColor: platform.tabBarActiveTextColor,
      selectedIconColor: platform.tabBarActiveTextColor,
      textColor: platform.tabBarTextColor,
      iconColor: platform.tabBarTextColor,
    },
    topBar: {
      borderColor: platform.toolbarDefaultBorder,
      // drawBehind: true,
      background: {
        color: Platform.select({
          android: platform.toolbarDefaultBg,
        }),
        // translucent: true,
        // blur: true,
      },
      title: {
        color: platform.toolbarBtnTextColor,
      },
      largeTitle: {
        visible: true,
      },
    },
  })
}

export const registerComponents = (RnApp: React.ComponentType) => {
  for (const tab of Tabs.rnTabs) {
    log('registered tab %s', tab.name)
    Navigation.registerComponentWithRedux(tab.name, () => tab, RnApp, undefined)
  }

  for (const Dialog of appDialogs) {
    const component: React.FC<DialogContext> = ({ componentId, ...props }) => (
      <CoreContext.Consumer>
        {appContext => (
          <DialogContext.Provider value={{ ...appContext, componentId }}>
            <Dialog {...props} />
          </DialogContext.Provider>
        )}
      </CoreContext.Consumer>
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

const makeTab = (tab: TabComponent, passProps: CoreContext): LayoutBottomTabsChildren => ({
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

const bottomTabs = (passProps: CoreContext): LayoutBottomTabs => ({
  children: [
    makeTab(Tabs.HomeTab, passProps),
    makeTab(Tabs.AccountsTab, passProps),
    makeTab(Tabs.BillsTab, passProps),
    makeTab(Tabs.BudgetsTab, passProps),
    makeTab(Tabs.CalendarTab, passProps),
  ],
})

export const root = (passProps: CoreContext): LayoutRoot => ({
  root: {
    bottomTabs: bottomTabs(passProps),
  },
})
