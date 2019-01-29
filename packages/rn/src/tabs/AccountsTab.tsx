import { AppContext } from '@ag/app'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text, View } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'

export class AccountsTab extends React.PureComponent {
  static readonly id = 'AccountsTab'
  static readonly stackId = 'AccountsTabStack'

  static options = ({ intl }: AppContext): Options => {
    return {
      bottomTab: {
        text: intl.formatMessage(messages.tabText),
        icon: icons.accounts,
      },
      topBar: {
        title: {
          text: intl.formatMessage(messages.titleText),
        },
      },
    }
  }

  render() {
    return (
      <View>
        <Text>Accounts</Text>
      </View>
    )
  }
}

const messages = defineMessages({
  tabText: {
    id: 'AccountsTab.tabText',
    defaultMessage: 'Accounts',
  },
  titleText: {
    id: 'AccountsTab.titleText',
    defaultMessage: 'Accounts',
  },
})
