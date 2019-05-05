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

export const HomeTab = Object.assign(
  React.memo<Props>(function _HomeTab({ componentId }) {
    return (
      <VisibleRoot componentId={componentId}>
        <HomePage />
      </VisibleRoot>
    )
  }),
  {
    displayName: 'HomeTab',
    id: 'HomeTab',
    stackId: 'HomeTabStack',

    options: ({ intl }: CoreContext): Options => ({
      bottomTab: {
        text: intl.formatMessage(HomePage.messages.tabText),
        icon: icons.home,
      },
      topBar: {
        title: {
          text: intl.formatMessage(HomePage.messages.titleText),
        },
      },
    }),
  }
)
