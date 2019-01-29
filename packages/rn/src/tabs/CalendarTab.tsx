import { AppContext } from '@ag/app'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text, View } from 'react-native'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'

export class CalendarTab extends React.PureComponent {
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
      <View>
        <Text>Calendar</Text>
      </View>
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
