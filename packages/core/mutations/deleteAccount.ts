import ApolloClient from 'apollo-client'
import assert from 'assert'
import { defineMessages } from 'react-intl'
import { Gql, gql } from '../components'
import { AppContext } from '../context'
import * as T from '../graphql-types'
import { HomePage } from '../pages'

const mutations = {
  DeleteAccount: gql`
    mutation DeleteAccount($accountId: String!) {
      deleteAccount(accountId: $accountId)
    }
  ` as Gql<T.DeleteAccount.Mutation, T.DeleteAccount.Variables>,
}

interface DeleteAccountParams {
  client: ApolloClient<any>
  context: AppContext
  account: {
    id: string
    name: string
  }
}

export const deleteAccount = ({ client, context, account }: DeleteAccountParams) => {
  const {
    ui: { alert, showToast },
    intl,
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
        mutation: mutations.DeleteAccount,
        variables,
        refetchQueries: [{ query: HomePage.queries.HomePage }],
      })
      assert(result.data && result.data.deleteAccount)

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
