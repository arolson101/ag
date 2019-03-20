import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { QueryHookResult } from 'react-apollo-hooks'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { Gql, Link, useQuery } from '../components'
import { CoreContext, TableColumn } from '../context'
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
          id
          favicon
          name
          accounts {
            id
            name
            number
            visible
          }
        }
      }
    }
  ` as Gql<T.AccountsPage.Query, T.AccountsPage.Variables>,
}

const Component: React.FC<
  QueryHookResult<T.AccountsPage.Query, T.AccountsPage.Variables>
> = function AccountsPageComponent({ data, loading }) {
  const {
    intl,
    ui: { Column, Page, Row, Table, Text, Image },
  } = useContext(CoreContext)

  const columns: Array<TableColumn<T.AccountsPage.Accounts>> = [
    {
      dataIndex: 'name',
      title: intl.formatMessage(messages.colName),
    },
    {
      dataIndex: 'number',
      title: intl.formatMessage(messages.colNumber),
    },
    {
      dataIndex: 'visible',
      title: intl.formatMessage(messages.colVisible),
    },
  ]

  return (
    <Page>
      {data &&
        data.appDb &&
        data.appDb.banks.map(bank => (
          <Table
            key={bank.id}
            title={() => (
              <Text header>
                <Image src={bank.favicon} size={50} />
                {bank.name}
              </Text>
            )}
            rowKey={'id'}
            emptyText={intl.formatMessage(messages.noAccounts)}
            data={bank.accounts}
            columns={columns}
          />
        ))}

      <Row>
        <Link dispatch={actions.openDlg.bankCreate()}>add bank</Link>
      </Row>
    </Page>
  )
}

const messages = defineMessages({
  colName: {
    id: 'AccountsPage.colName',
    defaultMessage: 'Account',
  },
  colNumber: {
    id: 'AccountsPage.colNumber',
    defaultMessage: 'Number',
  },
  colVisible: {
    id: 'AccountsPage.colVisible',
    defaultMessage: 'Visible',
  },
  noAccounts: {
    id: 'AccountsPage.noAccounts',
    defaultMessage: 'No Accounts',
  },
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
