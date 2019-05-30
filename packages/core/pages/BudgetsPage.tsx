import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React from 'react'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { useIntl, useUi } from '../context'
import * as T from '../graphql-types'

const log = debug('core:BudgetsPage')

interface Props {
  componentId?: string
}
type ComponentProps = Props & QueryHookResult<T.BudgetsPage.Query, T.BudgetsPage.Variables>

const queries = {
  BudgetsPage: gql`
    query BudgetsPage {
      accounts {
        id
        name
      }
    }
  ` as Gql<T.BudgetsPage.Query, T.BudgetsPage.Variables>,
}

const Component = Object.assign(
  React.memo<ComponentProps>(function _BudgetsPage_Component({ componentId, data, loading }) {
    const intl = useIntl()
    const { Page, Text } = useUi()

    return (
      <Page title={intl.formatMessage(messages.titleText)} componentId={componentId}>
        <Text header>Budgets</Text>
        {data &&
          data.accounts &&
          data.accounts.map(account => <Text key={account.id}>{account.name}</Text>)}
      </Page>
    )
  }),
  {
    displayName: 'BudgetsPage.Component',
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

const path = '/budgets'
const route = docuri.route<void, string>(path)

export const BudgetsPage = Object.assign(
  React.memo<Props>(function _BudgetsPage(props) {
    const q = useQuery(BudgetsPage.queries.BudgetsPage)

    return (
      <>
        <ErrorDisplay error={q.error} />
        <Component {...props} {...q} />
      </>
    )
  }),
  {
    displayName: 'BudgetsPage',
    queries,
    Component,
    messages,
    path,
    route,
  }
)
