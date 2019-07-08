import debug from 'debug'
import docuri from 'docuri'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

const log = debug('core:BillsPage')

interface Props {
  componentId?: string
}

const path = '/bills'
const route = docuri.route<void, string>(path)

export const BillsPage = Object.assign(
  React.memo<Props>(function _BillsPage({ componentId }) {
    const intl = useIntl()
    const { Page, Row, Text } = useUi()
    const accounts = useSelector(selectors.accounts)

    return (
      <Page title={intl.formatMessage(messages.titleText)} componentId={componentId}>
        <Text header>Bills</Text>
        {accounts.map(account => (
          <Text key={account.id}>{account.name}</Text>
        ))}
      </Page>
    )
  }),
  {
    displayName: 'BillsPage',
    path,
    route,
    messages: () => messages,
  }
)

const messages = defineMessages({
  tabText: {
    id: 'BillsPage.tabText',
    defaultMessage: 'Bills',
  },
  titleText: {
    id: 'BillsPage.titleText',
    defaultMessage: 'Bills',
  },
})
