import { AppContext } from '@ag/app'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class BudgetsTab extends React.PureComponent<Props> {
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
      <VisibleRoot componentId={this.props.componentId}>
        <Text>Budgets</Text>
      </VisibleRoot>
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
