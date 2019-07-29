import { Transaction } from '@ag/db'
import { formatCurrency } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import React, { useCallback, useEffect, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { useAccountTransactions } from '../components'
import { ActionDesc, TableColumn, useAction, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

const log = debug('core:AccountPage')

interface Props {
  accountId: string
}

interface Row extends Required<Transaction.Props> {
  id: string
  balance: number
}

const path = '/accounts/:accountId'
const route = docuri.route<Props, string>(path)

export const AccountPage = Object.assign(
  React.memo<Props>(function _AccountPage({ accountId }) {
    const intl = useIntl()
    const openDlgTransactionCreate = useAction(actions.openDlg.transactionCreate)
    const openDlgTransactionEdit = useAction(actions.openDlg.transactionEdit)
    const deleteTransaction = useAction(thunks.deleteTransaction)
    const getBank = useSelector(selectors.getBank)
    const getTransactions = useSelector(selectors.getTransactions)
    const defaultCurrency = useSelector(selectors.currency)
    const { Page, Table, Text } = useUi()

    const account = useSelector(selectors.getAccount)(accountId)

    useAccountTransactions(accountId)

    const rowAdd = useMemo<ActionDesc>(
      () => ({
        icon: 'add',
        text: intl.formatMessage(messages.transactionCreate),
        onClick: () => openDlgTransactionCreate({ accountId }),
      }),
      [intl, openDlgTransactionCreate, accountId]
    )

    const rowEdit = useCallback(
      (transaction: Row): ActionDesc => ({
        icon: 'edit',
        text: intl.formatMessage(messages.transactionEdit),
        onClick: () => openDlgTransactionEdit({ accountId, transactionId: transaction.id }),
      }),
      [intl, openDlgTransactionEdit, accountId]
    )

    const rowDelete = useCallback(
      (transaction: Row): ActionDesc => ({
        icon: 'trash',
        text: intl.formatMessage(messages.transactionDelete),
        onClick: () => deleteTransaction(transaction.id),
        danger: true,
      }),
      [deleteTransaction]
    )

    const columns = useMemo<Array<TableColumn<Row>>>(
      () => [
        {
          dataIndex: 'time',
          width: 100,
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
        // {
        //   dataIndex: 'type',
        //   title: 'type',
        // },
        // {
        //   dataIndex: 'account',
        //   title: 'account',
        // },
        // {
        //   dataIndex: 'serverid',
        //   title: 'serverid',
        // },
        {
          dataIndex: 'amount',
          align: 'right',
          width: 100,
          title: intl.formatMessage(messages.colAmount),
          format: (value: number) =>
            formatCurrency(intl, value, account ? account.currencyCode : defaultCurrency),
        },
        {
          dataIndex: 'balance',
          align: 'right',
          width: 100,
          title: intl.formatMessage(messages.colBalance),
          format: (value: number) =>
            formatCurrency(intl, value, account ? account.currencyCode : defaultCurrency),
        },
      ],
      [intl]
    )

    if (!account) {
      return null
    }

    const bank = getBank(account.bankId)
    if (!bank) {
      throw new Error('no bank')
    }

    const transactions = getTransactions(account.id)
      .sort((a, b) => a.time.getTime() - b.time.getTime())
      .reduce(
        (txs, tx) => {
          const prevBalance = txs.length === 0 ? 0 : txs[txs.length - 1].balance
          txs.push({ ...tx, balance: prevBalance + tx.amount })
          return txs
        },
        [] as Row[]
      )
      .reverse()

    const title = account.name
    const subtitle = bank.name
    const tableTitle = intl.formatMessage(messages.tableTitle, {
      name: account.name,
      balance: formatCurrency(intl, account.balance, account.currencyCode),
    })

    return (
      <Page
        image={account.iconId || bank.iconId}
        title={title}
        subtitle={subtitle}
        button={{
          title: intl.formatMessage(messages.transactionAdd),
          onClick: () => openDlgTransactionCreate({ accountId }),
        }}
      >
        <Table
          titleText={tableTitle}
          rowKey={'id'}
          columns={columns}
          emptyText={intl.formatMessage(messages.noTransactions)}
          rowAdd={rowAdd}
          rowEdit={rowEdit}
          rowDelete={rowDelete}
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
  tableTitle: {
    id: 'AccountPage.tableTitle',
    defaultMessage: 'Balance {balance}',
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
  colBalance: {
    id: 'AccountPage.colBalance',
    defaultMessage: 'Balance',
  },
  colTime: {
    id: 'AccountPage.colTime',
    defaultMessage: 'Date',
  },
  transactionCreate: {
    id: 'AccountPage.transactionCreate',
    defaultMessage: 'Create Transaction',
  },
  transactionEdit: {
    id: 'AccountPage.transactionEdit',
    defaultMessage: 'Edit Transaction',
  },
  transactionDelete: {
    id: 'AccountPage.transactionDelete',
    defaultMessage: 'Delete Transaction',
  },
})
