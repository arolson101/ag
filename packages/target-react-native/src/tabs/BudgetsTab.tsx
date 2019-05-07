import { BudgetsPage } from '@ag/core'
import React from 'react'
import { RnnOptionsHandler } from '../app/RnnContext'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class BudgetsTab extends React.PureComponent<Props> {
  static readonly id = 'BudgetsTab'
  static readonly stackId = 'BudgetsTabStack'

  static options: RnnOptionsHandler = ({ intl }) => ({
    bottomTab: {
      text: intl.formatMessage(BudgetsPage.messages.tabText),
      icon: icons.budgets,
    },
    topBar: {
      title: {
        text: intl.formatMessage(BudgetsPage.messages.titleText),
      },
    },
  })

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <BudgetsPage />
      </VisibleRoot>
    )
  }
}
