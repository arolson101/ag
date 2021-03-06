import { AccountsPage } from '@ag/core/pages'
import { selectors } from '@ag/core/reducers'
import React from 'react'
import { RnnOptionsHandler } from '../app/RnnContext'
import { icons } from '../icons'
import { LoggedIn } from './LoggedIn'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class AccountsTab extends React.PureComponent<Props> {
  static readonly id = 'AccountsTab'
  static readonly stackId = 'AccountsTabStack'

  static options: RnnOptionsHandler = ({ store }) => {
    const intl = selectors.intl(store.getState())
    return {
      bottomTab: {
        text: intl.formatMessage(AccountsPage.messages().tabText),
        icon: icons.accounts,
      },
      topBar: {
        title: {
          text: intl.formatMessage(AccountsPage.messages().titleText),
        },
      },
    }
  }

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <LoggedIn>
          <AccountsPage componentId={this.props.componentId} />
        </LoggedIn>
      </VisibleRoot>
    )
  }
}
