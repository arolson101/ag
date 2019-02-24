import { AppContext } from '@ag/core'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class BillsTab extends React.PureComponent<Props> {
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
      <VisibleRoot componentId={this.props.componentId}>
        <Text>Bills</Text>
      </VisibleRoot>
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
