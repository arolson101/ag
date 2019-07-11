import { HomePage } from '@ag/core/pages'
import { selectors } from '@ag/core/reducers'
import debug from 'debug'
import React from 'react'
import { Options } from 'react-native-navigation'
import { RnnContext } from '../app/RnnContext'
import { icons } from '../icons'
import { LoggedIn } from './LoggedIn'
import { VisibleRoot } from './VisibleRoot'

const log = debug('rn:HomeTab')

interface Props {
  componentId: string
}

export const HomeTab = Object.assign(
  React.memo<Props>(function _HomeTab({ componentId }) {
    return (
      <VisibleRoot componentId={componentId}>
        <LoggedIn>
          <HomePage componentId={componentId} />
        </LoggedIn>
      </VisibleRoot>
    )
  }),
  {
    name: 'HomeTab',
    displayName: 'HomeTab',
    id: 'HomeTab',
    stackId: 'HomeTabStack',

    options: ({ store }: RnnContext): Options => {
      const intl = selectors.intl(store.getState())
      return {
        bottomTab: {
          text: intl.formatMessage(HomePage.messages().tabText),
          icon: icons.home,
        },
        topBar: {
          title: {
            text: intl.formatMessage(HomePage.messages().titleText),
          },
        },
      }
    },
  }
)
