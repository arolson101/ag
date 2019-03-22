import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:BillsPage')

interface Props {}
type ComponentProps = QueryHookResult<T.BillsPage.Query, T.BillsPage.Variables>

const queries = {
  BillsPage: gql`
    query BillsPage {
      appDb {
        accounts {
          id
          name
        }
      }
    }
  ` as Gql<T.BillsPage.Query, T.BillsPage.Variables>,
}

const Component = React.memo<ComponentProps>(({ data, loading }) => {
  const {
    intl,
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page title={intl.formatMessage(messages.titleText)}>
      <Text header>Bills</Text>
      {data &&
        data.appDb &&
        data.appDb.accounts.map(account => <Text key={account.id}>{account.name}</Text>)}
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

export const BillsPage = Object.assign(
  React.memo<Props>(props => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(BillsPage.queries.BillsPage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  }),
  {
    id: 'BillsPage',
    queries,
    Component,
    messages,
  }
)
