import { CoreContext } from '@ag/core'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class AccountsTab extends React.PureComponent<Props> {
  static readonly id = 'AccountsTab'
  static readonly stackId = 'AccountsTabStack'

  static options = ({ intl }: CoreContext): Options => {
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
      <VisibleRoot componentId={this.props.componentId}>
        <Text>Accounts</Text>
      </VisibleRoot>
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
