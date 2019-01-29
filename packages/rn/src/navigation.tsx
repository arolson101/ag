import { AppContext } from '@ag/app'
import debug from 'debug'
import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import {
  Layout,
  LayoutBottomTabs,
  LayoutBottomTabsChildren,
  LayoutRoot,
  Navigation,
  Options,
} from 'react-native-navigation'
import { ThemeManager } from 'react-native-ui-lib'
import { icons } from './icons'
import * as Tabs from './tabs'

const log = debug('rn:navigation')
log.enabled = true

const tab1stackId = 'tab1stack'

class ComponentTest extends React.PureComponent {
  static options = (passProps: any): Options => ({
    topBar: {
      title: { text: 'pushed item 2' },
      largeTitle: {
        visible: true,
      },
      rightButtons: [
        {
          id: 'add',
          systemItem: 'add',
        },
      ],
    },
    bottomTab: {
      text: 'Tab 2',
      // icon: icons.bank,
    },
  })

  render() {
    return (
      <SafeAreaView>
        <View>
          <Text>ComponentTest {JSON.stringify(this.props, null, '  ')}</Text>
          <TouchableOpacity onPress={() => Navigation.push(tab1stackId, pushedLayout)}>
            <Text>foo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const store = { foo: 'bar' }
const Provider: React.FC = props => <>{props.children}</>

Navigation.registerComponentWithRedux(`ComponentTest`, () => ComponentTest, Provider, store)

Navigation.setDefaultOptions({
  bottomTab: {
    selectedTextColor: ThemeManager.primaryColor,
    selectedIconColor: ThemeManager.primaryColor,
  },
  topBar: {
    largeTitle: {
      visible: true,
    },
  },
})

const pushedLayout: Layout = {
  component: {
    name: 'ComponentTest',
    passProps: {
      text: 'pushed layout',
    },
  },
}

const tab1 = (): LayoutBottomTabsChildren => {
  return {
    stack: {
      id: tab1stackId,
      children: [
        {
          component: {
            name: 'ComponentTest',
            passProps: {
              text: 'This is tab 1',
            },
            options: {
              topBar: {
                title: {
                  text: 'TAB 1',
                },
                largeTitle: {
                  visible: true,
                },
              },
            },
          },
        },
      ],
      options: {
        bottomTab: {
          text: 'tab 1a',
          icon: icons.home,
        },
      },
    },
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

for (const tab of [
  Tabs.AccountsTab,
  Tabs.BillsTab,
  Tabs.BudgetsTab,
  Tabs.CalendarTab,
  Tabs.HomeTab,
]) {
  Navigation.registerComponentWithRedux(tab.name, () => tab, Provider, store)
}

const bottomTabs = (passProps: AppContext): LayoutBottomTabs => ({
  children: [
    makeTab(Tabs.HomeTab, passProps),
    makeTab(Tabs.AccountsTab, passProps),
    makeTab(Tabs.BillsTab, passProps),
    makeTab(Tabs.BudgetsTab, passProps),
    makeTab(Tabs.CalendarTab, passProps),
  ],
})

const testProps: AppContext = {
  intl: {
    formatMessage: (message: any) => message.defaultMessage,
  },
} as any

export const root = (passProps: AppContext = testProps): LayoutRoot => ({
  root: {
    bottomTabs: bottomTabs(passProps),
  },
})
