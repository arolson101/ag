import { AppContext } from '@ag/app'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text, View } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'

export class HomeTab extends React.PureComponent {
  static readonly id = 'HomeTab'
  static readonly stackId = 'HomeTabStack'

  static options = ({ intl }: AppContext): Options => ({
    bottomTab: {
      text: intl.formatMessage(messages.tabText),
      icon: icons.home,
    },
    topBar: {
      title: {
        text: intl.formatMessage(messages.titleText),
      },
    },
  })

  render() {
    return (
      <View>
        <Text>Home</Text>
      </View>
    )
  }
}

const messages = defineMessages({
  tabText: {
    id: 'HomeTab.tabText',
    defaultMessage: 'Home',
  },
  titleText: {
    id: 'HomeTab.titleText',
    defaultMessage: 'Home',
  },
})
