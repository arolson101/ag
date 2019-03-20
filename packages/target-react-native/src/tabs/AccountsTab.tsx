import { AccountsPage, CoreContext } from '@ag/core'
import React from 'react'
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
        text: intl.formatMessage(AccountsPage.messages.tabText),
        icon: icons.accounts,
      },
      topBar: {
        title: {
          text: intl.formatMessage(AccountsPage.messages.titleText),
        },
      },
    }
  }

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <AccountsPage />
      </VisibleRoot>
    )
  }
}
