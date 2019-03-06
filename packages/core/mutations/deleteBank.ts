import ApolloClient from 'apollo-client'
import assert from 'assert'
import { defineMessages } from 'react-intl'
import { Gql, gql } from '../components'
import { AppContext } from '../context'
import * as T from '../graphql-types'
import { HomePage } from '../pages'

const mutations = {
  deleteBank: gql`
    mutation DeleteBank($bankId: String!) {
      deleteBank(bankId: $bankId)
    }
  ` as Gql<T.DeleteBank.Mutation, T.DeleteBank.Variables>,
}

interface DeleteBankParams {
  client: ApolloClient<any>
  context: AppContext
  bank: {
    id: string
    name: string
  }
}

export const deleteBank = ({ client, context, bank }: DeleteBankParams) => {
  const {
    ui: { alert, showToast },
    intl,
  } = context
  const intlCtx = { name: bank.name }

  alert({
    title: intl.formatMessage(messages.title),
    body: intl.formatMessage(messages.body, intlCtx),
    danger: true,

    confirmText: intl.formatMessage(messages.delete),
    onConfirm: async () => {
      const variables = { bankId: bank.id }
      const result = await client.mutate<T.DeleteBank.Mutation, T.DeleteBank.Variables>({
        mutation: mutations.deleteBank,
        variables,
        refetchQueries: [{ query: HomePage.queries.HomePage }],
      })
      assert(result.data && result.data.deleteBank)

      showToast(intl.formatMessage(messages.deleted, intlCtx), true)
    },

    cancelText: intl.formatMessage(messages.cancel),
    onCancel: () => {},
  })
}

const messages = defineMessages({
  title: {
    id: 'deleteBank.title',
    defaultMessage: 'Are you sure?',
  },
  body: {
    id: 'deleteBank.body',
    defaultMessage: "This will delete the bank '{name}', all its accounts and their transactions",
  },
  delete: {
    id: 'deleteBank.delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'deleteBank.cancel',
    defaultMessage: 'Cancel',
  },
  deleted: {
    id: 'deleteBank.deleted',
    defaultMessage: "Bank '{name}' deleted",
  },
})
