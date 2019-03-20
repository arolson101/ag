import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { QueryHookResult } from 'react-apollo-hooks'
import { actions } from '../actions'
import { Gql, Link, useQuery } from '../components'
import { BankDisplay } from '../components/BankDisplay'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:BillsPage')

export namespace BillsPage {
  export interface Props {}
}

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
    ${BankDisplay.fragments.BankDisplay}
  ` as Gql<T.BillsPage.Query, T.BillsPage.Variables>,
}

const Component: React.FC<
  QueryHookResult<T.BillsPage.Query, T.BillsPage.Variables>
> = function BillsPageComponent({ data, loading }) {
  const {
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page>
      <Text header>Bills</Text>
      {data &&
        data.appDb &&
        data.appDb.accounts.map(account => <Text key={account.id}>{account.name}</Text>)}
    </Page>
  )
}

export const BillsPage = Object.assign(
  (props: BillsPage.Props) => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(BillsPage.queries.BillsPage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  },
  {
    id: 'BillsPage',
    queries,
    Component,
  }
)
