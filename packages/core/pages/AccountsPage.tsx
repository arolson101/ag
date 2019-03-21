import { ui } from '@ag/ui-antd'
import debug from 'debug'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { QueryHookResult, useApolloClient } from 'react-apollo-hooks'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay, Gql, Link, useMutation, useQuery } from '../components'
import { ActionItem, CoreContext, TableColumn } from '../context'
import * as T from '../graphql-types'
import { deleteAccount, deleteBank } from '../mutations'

const log = debug('core:AccountsPage')

export namespace AccountsPage {
  export interface Props {}
}

const fragments = {
  BankFields: gql`
    fragment BankFields on Bank {
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
}

const queries = {
  AccountsPage: gql`
    query AccountsPage {
      appDb {
        banks {
          ...BankFields
        }
      }
    }
    ${fragments.BankFields}
  ` as Gql<T.AccountsPage.Query, T.AccountsPage.Variables>,
}

const mutations = {
  SyncAccounts: gql`
    mutation SyncAccounts($bankId: String!) {
      syncAccounts(bankId: $bankId) {
        ...BankFields
      }
    }
    ${fragments.BankFields}
  ` as Gql<T.SyncAccounts.Mutation, T.SyncAccounts.Variables>,
}

const Component: React.FC<
  QueryHookResult<T.AccountsPage.Query, T.AccountsPage.Variables>
> = function AccountsPageComponent({ data, loading }) {
  const context = useContext(CoreContext)
  const client = useApolloClient()
  const syncAccounts = useMutation(mutations.SyncAccounts, {
    refetchQueries: [{ query: queries.AccountsPage }],
  })

  const {
    intl,
    dispatch,
    ui: { Column, Page, Row, Table, Text, Image },
  } = context

  type Row = T.AccountsPage.Accounts
  const columns: Array<TableColumn<Row>> = [
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
            titleText={bank.name}
            titleImage={bank.favicon}
            titleContextMenuHeader={bank.name}
            titleActions={[
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
                          ui.showToast(
                            intl.formatMessage(messages.syncComplete, { name: bank.name })
                          )
                        } catch (error) {
                          ErrorDisplay.show(context, error)
                        }
                      },
                      disabled: !bank.online,
                    } as ActionItem,
                  ]
                : []),
            ]}
            rowKey={'id'}
            rowContextMenu={(account: Row) => ({
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
              ],
            })}
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
  contextMenuHeader: {
    id: 'AccountsPage.contextMenuHeader',
    defaultMessage: '{bankName} - {accountName}',
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
