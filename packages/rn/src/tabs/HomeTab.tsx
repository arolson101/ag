import { AppContext } from '@ag/app'
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

  componentDidMount() {
    log('component mounted: %o', this.props)
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: 'Title',
        },
      },
    })
  }

  render() {
    return (
      <View>
        <Text>Home</Text>
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
