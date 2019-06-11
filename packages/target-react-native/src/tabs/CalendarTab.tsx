import { CalendarPage } from '@ag/core/pages'
import { selectors } from '@ag/core/reducers'
import React from 'react'
import { RnnOptionsHandler } from '../app/RnnContext'
import { icons } from '../icons'
import { LoggedIn } from './LoggedIn'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class CalendarTab extends React.PureComponent<Props> {
  static readonly id = 'CalendarTab'
  static readonly stackId = 'CalendarTabStack'

  static options: RnnOptionsHandler = ({ store }) => {
    const intl = selectors.getIntl(store.getState())
    return {
      bottomTab: {
        text: intl.formatMessage(CalendarPage.messages().tabText),
        icon: icons.calendar,
      },
      topBar: {
        title: {
          text: intl.formatMessage(CalendarPage.messages().titleText),
        },
      },
    }
  }

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <LoggedIn>
          <CalendarPage componentId={this.props.componentId} />
        </LoggedIn>
      </VisibleRoot>
    )
  }
}
