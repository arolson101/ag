import { Gql, QueryHookResult, useQuery } from '@ag/util'
import debug from 'debug'
import docuri from 'docuri'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:AccountPage')

interface Props {
  accountId: string
}

const fragments = {}

const queries = {
  AccountPage: gql`
    query AccountPage($accountId: String!) {
      appDb {
        account(accountId: $accountId) {
          id
          name
          bank {
            name
            favicon
          }
        }
      }
    }
  ` as Gql<T.AccountPage.Query, T.AccountPage.Variables>,
}

const mutations = {}

type ComponentProps = Props & QueryHookResult<T.AccountPage.Query, T.AccountPage.Variables>
const Component = Object.assign(
  React.memo<ComponentProps>(({ accountId, data, loading }) => {
    const {
      intl,
      dispatch,
      ui: { Page },
    } = useContext(CoreContext)

    const account = data && data.appDb && data.appDb.account
    const title = (account && account.name) || 'no account'
    const subtitle = (account && account.bank.name) || 'no bank'

    return (
      <Page
        image={account ? account.bank.favicon : undefined}
        title={title}
        subtitle={subtitle}
        button={{
          title: intl.formatMessage(messages.transactionAdd),
          onClick: () => dispatch(actions.openDlg.bankCreate()),
        }}
      >
        account {accountId}
      </Page>
    )
  }),
  {
    displayName: 'AccountPage.Component',
  }
)

const messages = defineMessages({
  titleText: {
    id: 'AccountPage.titleText',
    defaultMessage: 'Accounts',
  },
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
})

const path = '/accounts/:accountId'
const route = docuri.route<Props, string>(path)

export const AccountPage = Object.assign(
  React.memo<Props>(props => {
    const { dispatch } = useContext(CoreContext)
    const [dispatched, setDispatched] = useState(false)
    const { accountId } = props
    const q = useQuery(AccountPage.queries.AccountPage, { variables: { accountId } })

    if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
      dispatch(actions.openDlg.login())
      setDispatched(true)
    }

    return <Component {...props} {...q} />
  }),
  {
    id: 'AccountPage',
    queries,
    Component,
    messages,
    path,
    route,
  }
)
