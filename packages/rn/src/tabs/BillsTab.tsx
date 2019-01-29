import { AppContext } from '@ag/app'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text, View } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'

export class BillsTab extends React.PureComponent {
  static readonly id = 'BillsTab'
  static readonly stackId = 'BillsTabStack'

  static options = ({ intl }: AppContext): Options => ({
    bottomTab: {
      text: intl.formatMessage(messages.tabText),
      icon: icons.bills,
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
        <Text>Bills</Text>
      </View>
    )
  }
}

const messages = defineMessages({
  tabText: {
    id: 'BillsTab.tabText',
    defaultMessage: 'Bills',
  },
  titleText: {
    id: 'BillsTab.titleText',
    defaultMessage: 'Bills',
  },
})
