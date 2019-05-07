import { Gql } from '@ag/util'
import ApolloClient from 'apollo-client'
import assert from 'assert'
import gql from 'graphql-tag'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { CoreContext, IntlContext } from '../context'
import * as T from '../graphql-types'

const mutations = {
  deleteAccount: gql`
    mutation DeleteAccount($accountId: String!) {
      deleteAccount(accountId: $accountId)
    }
  ` as Gql<T.DeleteAccount.Mutation, T.DeleteAccount.Variables>,
}

interface DeleteAccountParams {
  client: ApolloClient<any>
  context: CoreContext
  intl: IntlContext
  account: {
    id: string
    name: string
  }
}

export const deleteAccount = ({ client, context, intl, account }: DeleteAccountParams) => {
  const {
    ui: { alert, showToast },
  } = context
  const intlCtx = { name: account.name }

  alert({
    title: intl.formatMessage(messages.title),
    body: intl.formatMessage(messages.body, intlCtx),
    danger: true,

    confirmText: intl.formatMessage(messages.delete),
    onConfirm: async () => {
      const variables = { accountId: account.id }
      const result = await client.mutate<T.DeleteAccount.Mutation, T.DeleteAccount.Variables>({
        mutation: mutations.deleteAccount,
        variables,
        update: () => {
          client.reFetchObservableQueries()
        },
      })
      assert(result.data && result.data.deleteAccount)

      ErrorDisplay.show(context, intl, result.errors)
      showToast(intl.formatMessage(messages.deleted, intlCtx), true)
    },

    cancelText: intl.formatMessage(messages.cancel),
    onCancel: () => {},
  })
}

const messages = defineMessages({
  title: {
    id: 'deleteAccount.title',
    defaultMessage: 'Are you sure?',
  },
  body: {
    id: 'deleteAccount.body',
    defaultMessage: "This will delete the account '{name}' and all its transactions",
  },
  delete: {
    id: 'deleteAccount.delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'deleteAccount.cancel',
    defaultMessage: 'Cancel',
  },
  deleted: {
    id: 'deleteAccount.deleted',
    defaultMessage: "Account '{name}' deleted",
  },
})
