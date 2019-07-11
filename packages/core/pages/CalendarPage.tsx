import debug from 'debug'
import docuri from 'docuri'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

const log = debug('core:CalendarPage')

interface Props {
  componentId?: string
}

const path = '/calendar'
const route = docuri.route<void, string>(path)

export const CalendarPage = Object.assign(
  React.memo<Props>(function _CalendarPage({ componentId }) {
    const intl = useIntl()
    const { Page, Row, Text } = useUi()
    const accounts = useSelector(selectors.accounts)

    return (
      <Page title={intl.formatMessage(messages.titleText)} componentId={componentId}>
        <Text header>Calendar</Text>
        {accounts.map(account => (
          <Text key={account.id}>{account.name}</Text>
        ))}
      </Page>
    )
  }),
  {
    displayName: 'CalendarPage',
    path,
    route,
    messages: () => messages,
  }
)

const messages = defineMessages({
  tabText: {
    id: 'CalendarPage.tabText',
    defaultMessage: 'Calendar',
  },
  titleText: {
    id: 'CalendarPage.titleText',
    defaultMessage: 'Calendar',
  },
})
