import { BudgetsPage } from '@ag/core/pages'
import { selectors } from '@ag/core/reducers'
import debug from 'debug'
import React from 'react'
import { RnnOptionsHandler } from '../app/RnnContext'
import { icons } from '../icons'
import { LoggedIn } from './LoggedIn'
import { VisibleRoot } from './VisibleRoot'

const log = debug('rn:BudgetsTab')

interface Props {
  componentId: string
}

export class BudgetsTab extends React.PureComponent<Props> {
  static readonly id = 'BudgetsTab'
  static readonly stackId = 'BudgetsTabStack'

  static options: RnnOptionsHandler = ({ store }) => {
    const intl = selectors.intl(store.getState())
    return {
      bottomTab: {
        text: intl.formatMessage(BudgetsPage.messages().tabText),
        icon: icons.budgets,
      },
      topBar: {
        title: {
          text: intl.formatMessage(BudgetsPage.messages().titleText),
        },
      },
    }
  }

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <LoggedIn>
          <BudgetsPage componentId={this.props.componentId} />
        </LoggedIn>
      </VisibleRoot>
    )
  }
}
