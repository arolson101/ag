import {
  Gql,
  monthsAgo,
  QueryHookResult,
  standardizeDate,
  useApolloClient,
  useMutation,
  useQuery,
} from '@ag/util'
import debug from 'debug'
import gql from 'graphql-tag'
import React, { useCallback, useContext, useRef, useState } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { ActionItem, ContextMenuProps, CoreContext, TableColumn } from '../context'
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
    }
  `,
}

const queries = {
  AccountsPage: gql`
    query AccountsPage {
      appDb {
        banks {
          ...bankFields_AccountsPage
        }
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
}

const BankTable = Object.assign(
  React.memo<T.AccountsPage.Banks>(bank => {
    type Row = typeof bank.accounts[number]
    const context = useContext(CoreContext)
    const {
      intl,
      dispatch,
      ui: { Link, Text, Row, Table, showToast },
    } = context

    const syncAccounts = useMutation(mutations.SyncAccounts, {
      refetchQueries: [{ query: queries.AccountsPage }],
    })

    const downloadTransactions = useMutation(mutations.DownloadTransactions, {
      refetchQueries: [{ query: queries.AccountsPage }],
    })

    const client = useApolloClient()
    const titleActions = useRef<ActionItem[]>([
      {
        icon: 'edit',
        text: intl.formatMessage(messages.bankEdit),
        onClick: () => dispatch(actions.openDlg.bankEdit({ bankId: bank.id })),
      },
      {
        icon: 'trash',
        text: intl.formatMessage(messages.deleteBank),
        onClick: () => deleteBank({ context, bank, client }),
      },
      {
        icon: 'add',
        text: intl.formatMessage(messages.accountCreate),
        onClick: () => dispatch(actions.openDlg.accountCreate({ bankId: bank.id })),
      },
      ...(bank.online
        ? [
            {
              icon: 'sync',
              text: intl.formatMessage(messages.syncAccounts),
              onClick: async () => {
                try {
                  await syncAccounts({ variables: { bankId: bank.id } })
                  showToast(intl.formatMessage(messages.syncComplete, { name: bank.name }))
                } catch (error) {
                  ErrorDisplay.show(context, error)
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
              onClick: () => dispatch(actions.openDlg.accountEdit({ accountId: account.id })),
            },
            {
              icon: 'trash',
              text: intl.formatMessage(messages.deleteAccount),
              onClick: () => deleteAccount({ context, account, client }),
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
                  showToast(
                    intl.formatMessage(messages.getTransactionsComplete, { name: account.name })
                  )
                } catch (error) {
                  log('error downloading transactions: %o', error)
                  ErrorDisplay.show(context, error)
                }
              },
            },
          ],
        }
      },
      [bank, intl, context, client]
    )

    const columns = useRef<Array<TableColumn<Row>>>([
      {
        dataIndex: 'name',
        title: intl.formatMessage(messages.colName),
        render: (text: string, account: Row) => (
          <Link onClick={() => dispatch(actions.nav.account({ accountId: account.id }))}>
            <Text>{account.name}</Text>
          </Link>
        ),
      },
      {
        dataIndex: 'number',
        title: intl.formatMessage(messages.colNumber),
      },
      {
        dataIndex: 'visible',
        title: intl.formatMessage(messages.colVisible),
      },
    ])

    return (
      <Table
        key={bank.id}
        titleText={bank.name}
        titleImage={bank.favicon}
        titleContextMenuHeader={bank.name}
        titleActions={titleActions.current}
        rowKey={'id'}
        rowContextMenu={rowContextMenu}
        emptyText={intl.formatMessage(messages.noAccounts)}
        data={bank.accounts}
        columns={columns.current}
      />
    )
  }),
  {
    displayName: 'AccountsPage.BankTable',
  }
)

type ComponentProps = QueryHookResult<T.AccountsPage.Query, T.AccountsPage.Variables>
const Component = React.memo<ComponentProps>(({ data, loading }) => {
  const {
    intl,
    dispatch,
    ui: { Page },
  } = useContext(CoreContext)

  return (
    <Page
      title={intl.formatMessage(messages.titleText)}
      button={{
        title: intl.formatMessage(messages.bankAdd),
        onClick: () => dispatch(actions.openDlg.bankCreate()),
      }}
    >
      {data && //
        data.appDb &&
        data.appDb.banks.map(bank => <BankTable {...bank} key={bank.id} />)}
    </Page>
  )
})
Component.displayName = 'AccountsPage.Component'

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

export const AccountsPage = Object.assign(
  React.memo<Props>(props => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(AccountsPage.queries.AccountsPage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  }),
  {
    id: 'AccountsPage',
    queries,
    Component,
    messages,
  }
)
