import { CoreContext, HomePage } from '@ag/core'
import debug from 'debug'
import React from 'react'
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
      text: intl.formatMessage(HomePage.messages.tabText),
      icon: icons.home,
    },
    topBar: {
      title: {
        text: intl.formatMessage(HomePage.messages.titleText),
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
