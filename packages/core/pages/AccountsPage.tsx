import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { QueryHookResult } from 'react-apollo-hooks'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { Gql, Link, useQuery } from '../components'
import { BankDisplay } from '../components/BankDisplay'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:AccountsPage')

export namespace AccountsPage {
  export interface Props {}
}

const queries = {
  AccountsPage: gql`
    query AccountsPage {
      appDb {
        banks {
          ...BankDisplay
        }
      }
    }
    ${BankDisplay.fragments.BankDisplay}
  ` as Gql<T.AccountsPage.Query, T.AccountsPage.Variables>,
}

const Component: React.FC<
  QueryHookResult<T.AccountsPage.Query, T.AccountsPage.Variables>
> = function AccountsPageComponent({ data, loading }) {
  const {
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page>
      {data &&
        data.appDb &&
        data.appDb.banks.map(bank => <BankDisplay bank={bank} key={bank.id} />)}
      <Row>
        <Link dispatch={actions.openDlg.bankCreate()}>add bank</Link>
      </Row>
    </Page>
  )
}

const messages = defineMessages({
  tabText: {
    id: 'AccountsPage.tabText',
    defaultMessage: 'Accounts',
  },
  titleText: {
    id: 'AccountsPage.titleText',
    defaultMessage: 'Accounts',
  },
})

export const AccountsPage = Object.assign(
  (props: AccountsPage.Props) => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(AccountsPage.queries.AccountsPage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  },
  {
    id: 'AccountsPage',
    queries,
    Component,
    messages,
  }
)
