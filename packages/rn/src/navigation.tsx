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

Navigation.registerComponent(`ComponentTest`, () => ComponentTest)

Navigation.setDefaultOptions({
  bottomTab: {
    selectedTextColor: ThemeManager.primaryColor,
    selectedIconColor: ThemeManager.primaryColor,
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
          icon: icons.bank,
        },
      },
    },
  }
}

const bottomTabs = (): LayoutBottomTabs => ({
  children: [
    tab1(),
    {
      component: {
        name: 'ComponentTest',
        options: {
          topBar: {
            visible: true,
            title: {
              text: 'tab 2',
            },
          },
        },
      },
    },
  ],
})

export const root = (): LayoutRoot => ({
  root: {
    bottomTabs: bottomTabs(),
  },
})
