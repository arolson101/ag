import { BillsPage } from '@ag/core/pages'
import { selectors } from '@ag/core/reducers'
import React from 'react'
import { RnnOptionsHandler } from '../app/RnnContext'
import { icons } from '../icons'
import { LoggedIn } from './LoggedIn'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class BillsTab extends React.PureComponent<Props> {
  static readonly id = 'BillsTab'
  static readonly stackId = 'BillsTabStack'

  static options: RnnOptionsHandler = ({ store }) => {
    const intl = selectors.intl(store.getState())
    return {
      bottomTab: {
        text: intl.formatMessage(BillsPage.messages().tabText),
        icon: icons.bills,
      },
      topBar: {
        title: {
          text: intl.formatMessage(BillsPage.messages().titleText),
        },
      },
    }
  }

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <LoggedIn>
          <BillsPage componentId={this.props.componentId} />
        </LoggedIn>
      </VisibleRoot>
    )
  }
}
