import { AppContext } from '@ag/app'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

interface Props {
  componentId: string
}

export class CalendarTab extends React.PureComponent<Props> {
  static readonly id = 'CalendarTab'
  static readonly stackId = 'CalendarTabStack'

  static options = ({ intl }: AppContext): Options => ({
    bottomTab: {
      text: intl.formatMessage(messages.tabText),
      icon: icons.calendar,
    },
    topBar: {
      title: {
        text: intl.formatMessage(messages.titleText),
      },
    },
  })

  render() {
    return (
      <VisibleRoot componentId={this.props.componentId}>
        <Text>Calendar</Text>
      </VisibleRoot>
    )
  }
}

const messages = defineMessages({
  tabText: {
    id: 'CalendarTab.tabText',
    defaultMessage: 'Calendar',
  },
  titleText: {
    id: 'CalendarTab.titleText',
    defaultMessage: 'Calendar',
  },
})
