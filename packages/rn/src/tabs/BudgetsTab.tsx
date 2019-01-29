import { AppContext } from '@ag/app'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text, View } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'

export class BudgetsTab extends React.PureComponent {
  static readonly id = 'BudgetsTab'
  static readonly stackId = 'BudgetsTabStack'

  static options = ({ intl }: AppContext): Options => ({
    bottomTab: {
      text: intl.formatMessage(messages.tabText),
      icon: icons.budgets,
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
        <Text>Budgets</Text>
      </View>
    )
  }
}

const messages = defineMessages({
  tabText: {
    id: 'BudgetsTab.tabText',
    defaultMessage: 'Budgets',
  },
  titleText: {
    id: 'BudgetsTab.titleText',
    defaultMessage: 'Budgets',
  },
})
