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

const log = debug('core:AccountPage')

interface Props {}

const fragments = {}

const queries = {
  AccountPage: gql`
    query AccountPage {
      appDb {
        account {
          id
        }
      }
    }
  ` as Gql<T.AccountPage.Query, T.AccountPage.Variables>,
}

const mutations = {}

type ComponentProps = QueryHookResult<T.AccountPage.Query, T.AccountPage.Variables>
const Component = Object.assign(
  React.memo<ComponentProps>(({ data, loading }) => {
    const {
      intl,
      dispatch,
      ui: { Page },
    } = useContext(CoreContext)

    return (
      <Page
        title={intl.formatMessage(messages.titleText)}
        button={{
          title: intl.formatMessage(messages.transactionAdd),
          onClick: () => dispatch(actions.openDlg.bankCreate()),
        }}
      >
        account
      </Page>
    )
  }),
  {
    displayName: 'AccountPage.Component',
  }
)

const messages = defineMessages({
  contextMenuHeader: {
    id: 'AccountPage.contextMenuHeader',
    defaultMessage: '{bankName} - {accountName}',
  },
  transactionAdd: {
    id: 'AccountPage.transactionAdd',
    defaultMessage: 'Add Transaction',
  },
  bankEdit: {
    id: 'AccountPage.bankEdit',
    defaultMessage: 'Edit Bank',
  },
  deleteBank: {
    id: 'AccountPage.deleteBank',
    defaultMessage: 'Delete Bank',
  },
  syncAccounts: {
    id: 'AccountPage.syncAccounts',
    defaultMessage: 'Sync Accounts',
  },
  syncComplete: {
    id: 'AccountPage.syncComplete',
    defaultMessage: "Synced Accounts for '{name}'",
  },
  accountCreate: {
    id: 'AccountPage.accountCreate',
    defaultMessage: 'Add Account',
  },
  editAccount: {
    id: 'AccountPage.editAccount',
    defaultMessage: 'Edit Account',
  },
  deleteAccount: {
    id: 'AccountPage.deleteAccount',
    defaultMessage: 'Delete Account',
  },
  colName: {
    id: 'AccountPage.colName',
    defaultMessage: 'Account',
  },
  colNumber: {
    id: 'AccountPage.colNumber',
    defaultMessage: 'Number',
  },
  colVisible: {
    id: 'AccountPage.colVisible',
    defaultMessage: 'Visible',
  },
  noAccounts: {
    id: 'AccountPage.noAccounts',
    defaultMessage: 'No Accounts',
  },
  tabText: {
    id: 'AccountPage.tabText',
    defaultMessage: 'Accounts',
  },
  titleText: {
    id: 'AccountPage.titleText',
    defaultMessage: 'Accounts',
  },
  getTransactions: {
    id: 'AccountPage.getTransactions',
    defaultMessage: 'Download transactions',
  },
  getTransactionsComplete: {
    id: 'AccountPage.getTransactionsComplete',
    defaultMessage: 'Downloaded transactions for account {name}',
  },
})

export const AccountPage = Object.assign(
  React.memo<Props>(props => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const q = useQuery(AccountPage.queries.AccountPage)

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...q} />
  }),
  {
    id: 'AccountPage',
    queries,
    Component,
    messages,
  }
)
