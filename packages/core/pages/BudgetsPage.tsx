import debug from 'debug'
import docuri from 'docuri'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

const log = debug('core:BudgetsPage')

interface Props {
  componentId?: string
}

const path = '/budgets'
const route = docuri.route<void, string>(path)

export const BudgetsPage = Object.assign(
  React.memo<Props>(function _BudgetsPage({ componentId }) {
    const intl = useIntl()
    const { Page, Text } = useUi()
    const accounts = useSelector(selectors.accounts)

    return (
      <Page title={intl.formatMessage(messages.titleText)} componentId={componentId}>
        <Text header>Budgets</Text>
        {accounts.map(account => (
          <Text key={account.id}>{account.name}</Text>
        ))}
      </Page>
    )
  }),
  {
    displayName: 'BudgetsPage',
    path,
    route,
    messages: () => messages,
  }
)

const messages = defineMessages({
  tabText: {
    id: 'BudgetsPage.tabText',
    defaultMessage: 'Budgets',
  },
  titleText: {
    id: 'BudgetsPage.titleText',
    defaultMessage: 'Budgets',
  },
})
