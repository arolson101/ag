import { AppContext, HomePage } from '@ag/app'
import debug from 'debug'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Text, View } from 'react-native'
import { Navigation, Options } from 'react-native-navigation'
import { icons } from '../icons'

const log = debug('rn:HomeTab')
log.enabled = true

interface Props {
  componentId: string
}

export class HomeTab extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'HomeTab'
  static readonly stackId = 'HomeTabStack'

  static options = ({ intl }: AppContext): Options => ({
    bottomTab: {
      text: intl.formatMessage(messages.tabText),
      icon: icons.home,
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
        <HomePage />
      </View>
    )
  }
}

const messages = defineMessages({
  tabText: {
    id: 'HomeTab.tabText',
    defaultMessage: 'Home',
  },
  titleText: {
    id: 'HomeTab.titleText',
    defaultMessage: 'Home',
  },
})
