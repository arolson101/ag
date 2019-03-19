import { CoreContext, HomePage } from '@ag/core'
import debug from 'debug'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Options } from 'react-native-navigation'
import { icons } from '../icons'
import { VisibleRoot } from './VisibleRoot'

const log = debug('rn:HomeTab')

interface Props {
  componentId: string
}

export class HomeTab extends React.PureComponent<Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  static readonly id = 'HomeTab'
  static readonly stackId = 'HomeTabStack'

  static options = ({ intl }: CoreContext): Options => ({
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
      <VisibleRoot componentId={this.props.componentId}>
        <HomePage />
      </VisibleRoot>
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
