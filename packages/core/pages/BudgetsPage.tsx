import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { QueryHookResult } from 'react-apollo-hooks'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { Gql, Link, useQuery } from '../components'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:BudgetsPage')

export namespace BudgetsPage {
  export interface Props {}
}

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

const Component: React.FC<
  QueryHookResult<T.BudgetsPage.Query, T.BudgetsPage.Variables>
> = function BudgetsPageComponent({ data, loading }) {
  const {
    intl,
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
}

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

export const BudgetsPage = Object.assign(
  (props: BudgetsPage.Props) => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(BudgetsPage.queries.BudgetsPage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  },
  {
    id: 'BudgetsPage',
    queries,
    Component,
    messages,
  }
)
