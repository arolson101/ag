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

const log = debug('core:AccountsPage')

interface Props {}

const fragments = {
  bankFields: gql`
    fragment bankFields_AccountsPage on Bank {
      id
      name
      favicon
      online
      accounts {
        id
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
  SyncAccounts: gql`
    mutation SyncAccounts($bankId: String!) {
      syncAccounts(bankId: $bankId) {
        ...bankFields_AccountsPage
      }
    }
    ${fragments.bankFields}
  ` as Gql<T.SyncAccounts.Mutation, T.SyncAccounts.Variables>,

  DownloadTransactions: gql`
    mutation DownloadTransactions(
      $bankId: String!
      $accountId: String!
      $start: DateTime!
      $end: DateTime!
      $cancelToken: String!
    ) {
      downloadTransactions(
        bankId: $bankId
        accountId: $accountId
        start: $start
        end: $end
        cancelToken: $cancelToken
      ) {
        ...accountFields_AccountsPage
      }
    }
    ${fragments.accountFields}
  ` as Gql<T.DownloadTransactions.Mutation, T.DownloadTransactions.Variables>,

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
    const { Link, Text, Row, Table, showToast } = ui

    const setAccountsOrder = useMutation(mutations.SetAccountsOrder, {
      refetchQueries: [{ query: queries.AccountsPage }],
    })

    const moveRow = useCallback(
      (srcIndex: number, dstIndex: number) => {
        log('moveRow %d %d', srcIndex, dstIndex)
        const accountIds = arrayMove(bank.accounts, srcIndex, dstIndex) //
          .map(account => account.id)
        setAccountsOrder({ variables: { accountIds } })
      },
      [bank.accounts, setAccountsOrder]
    )

    const syncAccounts = useMutation(mutations.SyncAccounts)
    const downloadTransactions = useMutation(mutations.DownloadTransactions)

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
                  await syncAccounts({ variables: { bankId: bank.id } })
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
            },
            {
              icon: 'refresh',
              text: intl.formatMessage(messages.getTransactions),
              onClick: async () => {
                try {
                  const start = monthsAgo(1)
                  const end = standardizeDate(new Date())
                  await downloadTransactions({
                    variables: {
                      accountId: account.id,
                      cancelToken: 'asdf',
                      bankId: bank.id,
                      start,
                      end,
                    },
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
            <Text>{account.name}</Text>
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
        titleImage={bank.favicon}
        titleContextMenuHeader={bank.name}
        titleActions={titleActions.current}
        rowKey={'id'}
        rowContextMenu={rowContextMenu}
        emptyText={intl.formatMessage(messages.noAccounts)}
        data={bank.accounts}
        columns={columns.current}
        moveRow={moveRow}
      />
    )
  }),
  {
    displayName: 'AccountsPage.BankTable',
  }
)

type ComponentProps = QueryHookResult<T.AccountsPage.Query, T.AccountsPage.Variables>
const Component = Object.assign(
  React.memo<ComponentProps>(function _AccountsPage_Component({ data, loading }) {
    const intl = useIntl()
    const openBankCreateDlg = useAction(actions.openDlg.bankCreate)
    const { Page } = useUi()

    return (
      <Page
        title={intl.formatMessage(messages.titleText)}
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
        <Component {...q} />
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
