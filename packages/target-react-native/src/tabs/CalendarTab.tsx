import { CalendarPage } from '@ag/core'
import React from 'react'
import { RnnOptionsHandler } from '../app/RnnContext'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class CalendarTab extends React.PureComponent<Props> {
  static readonly id = 'CalendarTab'
  static readonly stackId = 'CalendarTabStack'

  static options: RnnOptionsHandler = ({ intl }) => ({
    bottomTab: {
      text: intl.formatMessage(CalendarPage.messages.tabText),
      icon: icons.calendar,
    },
    topBar: {
      title: {
        text: intl.formatMessage(CalendarPage.messages.titleText),
      },
    },
  })

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <CalendarPage />
      </VisibleRoot>
    )
  }
}
