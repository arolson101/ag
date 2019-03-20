import { BillsPage, CoreContext } from '@ag/core'
import React from 'react'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class BillsTab extends React.PureComponent<Props> {
  static readonly id = 'BillsTab'
  static readonly stackId = 'BillsTabStack'

  static options = ({ intl }: CoreContext): Options => ({
    bottomTab: {
      text: intl.formatMessage(BillsPage.messages.tabText),
      icon: icons.bills,
    },
    topBar: {
      title: {
        text: intl.formatMessage(BillsPage.messages.titleText),
      },
    },
  })

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <BillsPage />
      </VisibleRoot>
    )
  }
}
