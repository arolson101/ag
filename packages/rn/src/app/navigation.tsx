import { App, AppContext } from '@ag/app'
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

const log = debug('rn:navigation')
log.enabled = true

export const setDefaultOptions = () => {
  Navigation.setDefaultOptions({
    bottomTab: {
      selectedTextColor: platform.tabBarActiveTextColor,
      selectedIconColor: platform.tabBarActiveTextColor,
      textColor: platform.tabBarTextColor,
    },
    topBar: {
      largeTitle: {
        visible: true,
      },
    },
  })
}

export const registerComponents = (RnApp: React.ComponentType) => {
  for (const Tab of [
    Tabs.AccountsTab,
    Tabs.BillsTab,
    Tabs.BudgetsTab,
    Tabs.CalendarTab,
    Tabs.HomeTab,
  ]) {
    Navigation.registerComponentWithRedux(Tab.name, () => Tab, RnApp, undefined)
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

import { InjectedIntl, IntlProvider } from 'react-intl'
const intl = new IntlProvider({ locale: 'en' }).context.intl as InjectedIntl

const fakeProps = { intl: { formatMessage: (m: any) => m.defaultMessage } } as any

export const root = (passProps: AppContext = fakeProps): LayoutRoot => ({
  root: {
    bottomTabs: bottomTabs(fakeProps),
  },
})
