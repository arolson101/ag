import debug from 'debug'
import docuri from 'docuri'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useIntl, useUi } from '../context'

const log = debug('core:HomePage')

interface Props {
  componentId?: string
}

const path = '/home'
const route = docuri.route<void, string>(path)

export const HomePage = Object.assign(
  React.memo<Props>(function _HomePage({ componentId }) {
    const intl = useIntl()
    const { Page, Text } = useUi()

    return (
      <Page title={intl.formatMessage(messages.titleText)} componentId={componentId}>
        <Text header>Home</Text>
      </Page>
    )
  }),
  {
    displayName: 'HomePage',
    path,
    route,
    messages: () => messages,
  }
)

const messages = defineMessages({
  tabText: {
    id: 'HomePage.tabText',
    defaultMessage: 'Home',
  },
  titleText: {
    id: 'HomePage.titleText',
    defaultMessage: 'Home',
  },
})
