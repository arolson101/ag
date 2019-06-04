import {
  Gql,
  monthsAgo,
  QueryHookResult,
  standardizeDate,
  useApolloClient,
  useMutation,
  useQuery,
} from '@ag/util'
import arrayMove from 'array-move'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React, { useCallback, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { ActionItem, ContextMenuProps, TableColumn, useAction, useIntl, useUi } from '../context'
import * as T from '../graphql-types'
import { deleteAccount, deleteBank } from '../mutations'
import { thunks } from '../thunks'

const log = debug('core:AccountsPage')

interface Props {
  componentId?: string
}

const fragments = {
  bankFields: gql`
    fragment bankFields_AccountsPage on Bank {
      id
      name
      icon
      online
      accounts {
        id
        icon
        name
        number
        visible
        sortOrder
      }
    }
  `,

  accountFields: gql`
    fragment accountFields_AccountsPage on Account {
      id
      bankId

      name
      icon
      color
      type
      number
      visible
      routing
      key
      sortOrder
    }
  `,
}

const queries = {
  AccountsPage: gql`
    query AccountsPage {
      banks {
        ...bankFields_AccountsPage
      }
    }
    ${fragments.bankFields}
  ` as Gql<T.AccountsPage.Query, T.AccountsPage.Variables>,
}

const mutations = {
  SetAccountsOrder: gql`
    mutation SetAccountsOrder($accountIds: [String!]!) {
      setAccountsOrder(accountIds: $accountIds)
    }
  ` as Gql<T.SetAccountsOrder.Mutation, T.SetAccountsOrder.Variables>,
}

const BankTable = Object.assign(
  React.memo<T.AccountsPage.Banks>(function _BankTable(bank) {
    type Row = typeof bank.accounts[number]
    const intl = useIntl()
    const openBankEditDlg = useAction(actions.openDlg.bankEdit)
    const openAccountCreateDlg = useAction(actions.openDlg.accountCreate)
    const openAccountEditDlg = useAction(actions.openDlg.accountEdit)
    const navAccount = useAction(actions.nav.account)
    const ui = useUi()
    const { Link, Text, Row, Table, Image, showToast } = ui

    const setAccountsOrder = useMutation(mutations.SetAccountsOrder, {
      refetchQueries: [{ query: queries.AccountsPage }],
    })

    const moveRow = useCallback(
      (srcIndex: number, dstIndex: number) => {
        // log('moveRow %d %d', srcIndex, dstIndex)
        const accountIds = arrayMove(bank.accounts, srcIndex, dstIndex) //
          .map(account => account.id)
        setAccountsOrder({ variables: { accountIds } })
      },
      [bank.accounts, setAccountsOrder]
    )

    const syncAccounts = useAction(thunks.syncAccounts)
    const downloadTransactions = useAction(thunks.downloadTransactions)

    const client = useApolloClient()
    const titleActions = useRef<ActionItem[]>([
      {
        icon: 'edit',
        text: intl.formatMessage(messages.bankEdit),
        onClick: () => openBankEditDlg({ bankId: bank.id }),
      },
      {
        icon: 'trash',
        text: intl.formatMessage(messages.deleteBank),
        onClick: () => deleteBank({ ui, intl, bank, client }),
      },
      {
        icon: 'add',
        text: intl.formatMessage(messages.accountCreate),
        onClick: () => openAccountCreateDlg({ bankId: bank.id }),
      },
      ...(bank.online
        ? [
            {
              icon: 'sync',
              text: intl.formatMessage(messages.syncAccounts),
              onClick: async () => {
                try {
                  await syncAccounts(bank.id)
                  client.reFetchObservableQueries()
                  showToast(intl.formatMessage(messages.syncComplete, { name: bank.name }))
                } catch (error) {
                  ErrorDisplay.show(ui, intl, error)
                }
              },
              disabled: !bank.online,
            } as ActionItem,
          ]
        : []),
    ])

    const rowContextMenu = useCallback(
      function RowContextMenu(account: Row): ContextMenuProps {
        return {
          header: intl.formatMessage(messages.contextMenuHeader, {
            bankName: bank.name,
            accountName: account.name,
          }),
          actions: [
            {
              icon: 'edit',
              text: intl.formatMessage(messages.editAccount),
              onClick: () => openAccountEditDlg({ accountId: account.id }),
            },
            {
              icon: 'trash',
              text: intl.formatMessage(messages.deleteAccount),
              onClick: () => deleteAccount({ ui, intl, account, client }),
              danger: true,
            },
            {
              icon: 'refresh',
              text: intl.formatMessage(messages.getTransactions),
              onClick: async () => {
                try {
                  const start = monthsAgo(1)
                  const end = standardizeDate(new Date())
                  await downloadTransactions({
                    accountId: account.id,
                    bankId: bank.id,
                    start,
                    end,
                  })
                  client.reFetchObservableQueries()
                  showToast(
                    intl.formatMessage(messages.getTransactionsComplete, { name: account.name })
                  )
                } catch (error) {
                  log('error downloading transactions: %o', error)
                  ErrorDisplay.show(ui, intl, error)
                }
              },
            },
          ],
        }
      },
      [bank, intl, client]
    )

    const columns = useRef<Array<TableColumn<Row>>>([
      {
        dataIndex: 'name',
        title: intl.formatMessage(messages.colName),
        render: (text: string, account: Row) => (
          <Link onClick={() => navAccount({ accountId: account.id })}>
            <Text icon={account.icon || bank.icon}>{account.name}</Text>
          </Link>
        ),
      },
      // {
      //   dataIndex: 'sortOrder',
      //   title: 'sortOrder',
      // },
      // {
      //   dataIndex: 'id',
      //   title: 'id',
      // },
      // {
      //   dataIndex: 'number',
      //   title: intl.formatMessage(messages.colNumber),
      // },
      {
        dataIndex: 'visible',
        title: intl.formatMessage(messages.colVisible),
      },
    ])

    return (
      <Table
        titleText={bank.name}
        titleImage={bank.icon}
        titleContextMenuHeader={bank.name}
        titleActions={titleActions.current}
        rowKey={'id'}
        rowContextMenu={rowContextMenu}
        emptyText={intl.formatMessage(messages.noAccounts)}
        data={bank.accounts}
        columns={columns.current}
        moveRow={moveRow}
        dragId={bank.id}
      />
    )
  }),
  {
    displayName: 'AccountsPage.BankTable',
  }
)

type ComponentProps = Props & QueryHookResult<T.AccountsPage.Query, T.AccountsPage.Variables>
const Component = Object.assign(
  React.memo<ComponentProps>(function _AccountsPage_Component({ componentId, data, loading }) {
    const intl = useIntl()
    const openBankCreateDlg = useAction(actions.openDlg.bankCreate)
    const { Page } = useUi()

    log('data %o', data)

    return (
      <Page
        title={intl.formatMessage(messages.titleText)}
        componentId={componentId}
        button={{
          title: intl.formatMessage(messages.bankAdd),
          onClick: openBankCreateDlg,
        }}
      >
        {data &&
          data.banks &&
          data.banks.map(bank => (
            <BankTable
              {...bank}
              key={
                bank.id //
              }
            />
          ))}
      </Page>
    )
  }),
  {
    displayName: 'AccountsPage.Component',
  }
)

const messages = defineMessages({
  contextMenuHeader: {
    id: 'AccountsPage.contextMenuHeader',
    defaultMessage: '{bankName} - {accountName}',
  },
  bankAdd: {
    id: 'AccountsPage.bankAdd',
    defaultMessage: 'Add Bank',
  },
  bankEdit: {
    id: 'AccountsPage.bankEdit',
    defaultMessage: 'Edit Bank',
  },
  deleteBank: {
    id: 'AccountsPage.deleteBank',
    defaultMessage: 'Delete Bank',
  },
  syncAccounts: {
    id: 'AccountsPage.syncAccounts',
    defaultMessage: 'Sync Accounts',
  },
  syncComplete: {
    id: 'AccountsPage.syncComplete',
    defaultMessage: "Synced Accounts for '{name}'",
  },
  accountCreate: {
    id: 'AccountsPage.accountCreate',
    defaultMessage: 'Add Account',
  },
  editAccount: {
    id: 'AccountsPage.editAccount',
    defaultMessage: 'Edit Account',
  },
  deleteAccount: {
    id: 'AccountsPage.deleteAccount',
    defaultMessage: 'Delete Account',
  },
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
  getTransactions: {
    id: 'AccountsPage.getTransactions',
    defaultMessage: 'Download transactions',
  },
  getTransactionsComplete: {
    id: 'AccountsPage.getTransactionsComplete',
    defaultMessage: 'Downloaded transactions for account {name}',
  },
})

const path = '/accounts'
const route = docuri.route<void, string>(path)

export const AccountsPage = Object.assign(
  React.memo<Props>(function _AccountsPage(props) {
    const q = useQuery(AccountsPage.queries.AccountsPage)
    // log('AccountsPage render %o', q)

    return (
      <>
        <ErrorDisplay error={q.error} />
        <Component {...props} {...q} />
      </>
    )
  }),
  {
    displayName: 'AccountsPage',
    queries,
    Component,
    messages,
    path,
    route,
  }
)
