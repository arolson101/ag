import { BudgetsPage, CoreContext } from '@ag/core'
import React from 'react'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class BudgetsTab extends React.PureComponent<Props> {
  static readonly id = 'BudgetsTab'
  static readonly stackId = 'BudgetsTabStack'

  static options = ({ intl }: CoreContext): Options => ({
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
