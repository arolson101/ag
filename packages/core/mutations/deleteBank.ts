import { Gql } from '@ag/util'
import ApolloClient from 'apollo-client'
import assert from 'assert'
import gql from 'graphql-tag'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const mutations = {
  deleteBank: gql`
    mutation DeleteBank($bankId: String!) {
      deleteBank(bankId: $bankId)
    }
  ` as Gql<T.DeleteBank.Mutation, T.DeleteBank.Variables>,
}

interface DeleteBankParams {
  client: ApolloClient<any>
  context: CoreContext
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
        update: () => {
          client.reFetchObservableQueries()
        },
      })
      assert(result.data && result.data.deleteBank)

      ErrorDisplay.show(context, result.errors)
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
