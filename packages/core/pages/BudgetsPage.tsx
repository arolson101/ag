import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { CoreContext, useIntl } from '../context'
import * as T from '../graphql-types'

const log = debug('core:BudgetsPage')

interface Props {}
type ComponentProps = QueryHookResult<T.BudgetsPage.Query, T.BudgetsPage.Variables>

const queries = {
  BudgetsPage: gql`
    query BudgetsPage {
      appDb {
        accounts {
          id
          name
        }
      }
    }
  ` as Gql<T.BudgetsPage.Query, T.BudgetsPage.Variables>,
}

const Component = React.memo<ComponentProps>(({ data, loading }) => {
  const intl = useIntl()
  const {
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page title={intl.formatMessage(messages.titleText)}>
      <Text header>Budgets</Text>
      {data &&
        data.appDb &&
        data.appDb.accounts.map(account => <Text key={account.id}>{account.name}</Text>)}
    </Page>
  )
})
Component.displayName = 'BudgetsPage.Component'

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
  React.memo<Props>(props => {
    const q = useQuery(BudgetsPage.queries.BudgetsPage)

    return (
      <>
        <ErrorDisplay error={q.error} />
        <Component {...q} />
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
