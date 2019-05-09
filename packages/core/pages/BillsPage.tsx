import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React from 'react'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { useIntl, useUi } from '../context'
import * as T from '../graphql-types'

const log = debug('core:BillsPage')

interface Props {}
type ComponentProps = QueryHookResult<T.BillsPage.Query, T.BillsPage.Variables>

const queries = {
  BillsPage: gql`
    query BillsPage {
      accounts {
        id
        name
      }
    }
  ` as Gql<T.BillsPage.Query, T.BillsPage.Variables>,
}

const Component = React.memo<ComponentProps>(({ data, loading }) => {
  const intl = useIntl()
  const { Page, Row, Text } = useUi()

  return (
    <Page title={intl.formatMessage(messages.titleText)}>
      <Text header>Bills</Text>
      {data &&
        data.accounts &&
        data.accounts.map(account => <Text key={account.id}>{account.name}</Text>)}
    </Page>
  )
})
Component.displayName = 'BillsPage.Component'

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

const path = '/bills'
const route = docuri.route<void, string>(path)

export const BillsPage = Object.assign(
  React.memo<Props>(props => {
    const q = useQuery(BillsPage.queries.BillsPage)

    return (
      <>
        <ErrorDisplay error={q.error} />
        <Component {...q} />
      </>
    )
  }),
  {
    displayName: 'BillsPage',
    queries,
    Component,
    messages,
    path,
    route,
  }
)
