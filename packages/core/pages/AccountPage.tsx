import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React, { useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { TableColumn, useAction, useIntl, useUi } from '../context'
import * as T from '../graphql-types'

const log = debug('core:AccountPage')

interface Props {
  accountId: string
}

const fragments = {}

const queries = {
  AccountPage: gql`
    query AccountPage($accountId: String!) {
      account(accountId: $accountId) {
        id
        name
        bank {
          name
          favicon
        }
        transactions {
          id
          time
          account
          serverid
          type
          name
          memo
          amount
          balance
        }
      }
    }
  ` as Gql<T.AccountPage.Query, T.AccountPage.Variables>,
}

const mutations = {}

type ComponentProps = Props & QueryHookResult<T.AccountPage.Query, T.AccountPage.Variables>
const Component = Object.assign(
  React.memo<ComponentProps>(({ accountId, data, loading }) => {
    const intl = useIntl()
    const openBankCreateDlg = useAction(actions.openDlg.bankCreate)
    const { Page, Table, Text } = useUi()

    const account = data && data.account
    const title = (account && account.name) || 'no account'
    const subtitle = (account && account.bank.name) || 'no bank'

    type Row = NonNullable<typeof account>['transactions'][number]
    const columns = useRef<Array<TableColumn<Row>>>([
      {
        dataIndex: 'time',
        title: intl.formatMessage(messages.colTime),
        format: (text: string) => intl.formatDate(new Date(text)),
      },
      {
        dataIndex: 'name',
        title: intl.formatMessage(messages.colName),
      },
      {
        dataIndex: 'memo',
        title: 'memo',
      },
      {
        dataIndex: 'type',
        title: 'type',
      },
      {
        dataIndex: 'account',
        title: 'account',
      },
      {
        dataIndex: 'serverid',
        title: 'serverid',
      },
      {
        dataIndex: 'amount',
        align: 'right',
        title: intl.formatMessage(messages.colAmount),
        format: (text: string) =>
          intl.formatNumber(parseFloat(text), {
            style: 'currency',
            currency: 'USD',
            // currencyDisplay: 'symbol',
          }),
      },
    ])

    return (
      <Page
        image={account ? account.bank.favicon : undefined}
        title={title}
        subtitle={subtitle}
        button={{
          title: intl.formatMessage(messages.transactionAdd),
          onClick: openBankCreateDlg,
        }}
      >
        <Table
          rowKey={'id'}
          columns={columns.current}
          emptyText={intl.formatMessage(messages.noTransactions)}
          data={account ? account.transactions : []}
        />
      </Page>
    )
  }),
  {
    displayName: 'AccountPage.Component',
  }
)

const messages = defineMessages({
  transactionAdd: {
    id: 'AccountPage.transactionAdd',
    defaultMessage: 'Add Transaction',
  },
  getTransactions: {
    id: 'AccountPage.getTransactions',
    defaultMessage: 'Download transactions',
  },
  getTransactionsComplete: {
    id: 'AccountPage.getTransactionsComplete',
    defaultMessage: 'Downloaded transactions for account {name}',
  },
  noTransactions: {
    id: 'AccountPage.noTransactions',
    defaultMessage: 'No transactions',
  },
  colName: {
    id: 'AccountPage.colName',
    defaultMessage: 'Name',
  },
  colAmount: {
    id: 'AccountPage.colAmount',
    defaultMessage: 'Amount',
  },
  colTime: {
    id: 'AccountPage.colTime',
    defaultMessage: 'Date',
  },
})

const path = '/accounts/:accountId'
const route = docuri.route<Props, string>(path)

export const AccountPage = Object.assign(
  React.memo<Props>(props => {
    const { accountId } = props
    const q = useQuery(AccountPage.queries.AccountPage, { variables: { accountId } })

    return (
      <>
        <ErrorDisplay error={q.error} />
        <Component {...props} {...q} />
      </>
    )
  }),
  {
    displayName: 'AccountPage',
    queries,
    Component,
    messages,
    path,
    route,
  }
)
