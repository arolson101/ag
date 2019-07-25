import { Transaction } from '@ag/db'
import { formatCurrency } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import React, { useEffect, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { TableColumn, useAction, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

const log = debug('core:AccountPage')

interface Props {
  accountId: string
}

const path = '/accounts/:accountId'
const route = docuri.route<Props, string>(path)

export const AccountPage = Object.assign(
  React.memo<Props>(function _AccountPage({ accountId }) {
    const intl = useIntl()
    const transactionCreate = useAction(actions.openDlg.transactionCreate)
    const getBank = useSelector(selectors.getBank)
    const getTransactions = useSelector(selectors.getTransactions)
    const dbLoadTransactions = useAction(thunks.dbLoadTransactions)
    const { Page, Table, Text } = useUi()

    const account = useSelector(selectors.getAccount)(accountId)

    type Row = Transaction
    const columns = useMemo<Array<TableColumn<Row>>>(
      () => [
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
          format: (value: number) => formatCurrency(intl, value, account!.currencyCode),
        },
      ],
      [intl]
    )

    useEffect(() => {
      dbLoadTransactions({ accountId })
    }, [dbLoadTransactions, accountId])

    if (!account) {
      return null
    }

    const bank = getBank(account.bankId)
    if (!bank) {
      throw new Error('no bank')
    }

    const transactions = getTransactions(account.id)

    const title = account.name
    const subtitle = bank.name

    return (
      <Page
        image={account.iconId || bank.iconId}
        title={title}
        subtitle={subtitle}
        button={{
          title: intl.formatMessage(messages.transactionAdd),
          onClick: () => transactionCreate({ accountId }),
        }}
      >
        <Table
          rowKey={'id'}
          columns={columns}
          emptyText={intl.formatMessage(messages.noTransactions)}
          data={transactions}
        />
      </Page>
    )
  }),
  {
    displayName: 'AccountPage',
    messages: () => messages,
    path,
    route,
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
