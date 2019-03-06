import ApolloClient from 'apollo-client'
import { defineMessages } from 'react-intl'
import { Gql, gql } from '../components'
import { AppContext } from '../context'
import { LoginForm } from '../forms'
import * as T from '../graphql-types'

const mutations = {
  deleteDb: gql`
    mutation DeleteDb($dbId: String!) {
      deleteDb(dbId: $dbId)
    }
  ` as Gql<T.DeleteDb.Mutation, T.DeleteDb.Variables>,
}

interface DeleteDbParams {
  client: ApolloClient<any>
  context: AppContext
  dbId: string
}

export const deleteDb = ({ client, context, dbId }: DeleteDbParams) => {
  const {
    ui: { alert, showToast },
    intl,
  } = context

  alert({
    title: intl.formatMessage(messages.title),
    body: intl.formatMessage(messages.body),
    danger: true,

    confirmText: intl.formatMessage(messages.delete),
    onConfirm: async () => {
      const variables = { dbId }
      const result = await client.mutate<T.DeleteDb.Mutation, T.DeleteDb.Variables>({
        mutation: mutations.deleteDb,
        variables,
        refetchQueries: [{ query: LoginForm.queries.LoginForm }],
      })

      showToast(intl.formatMessage(messages.deleted), true)
    },

    cancelText: intl.formatMessage(messages.cancel),
    onCancel: () => {},
  })
}

const messages = defineMessages({
  title: {
    id: 'DeleteDb.title',
    defaultMessage: 'Are you sure?',
  },
  body: {
    id: 'DeleteDb.body',
    defaultMessage: 'This will all your data.  This action cannot be undone.',
  },
  delete: {
    id: 'DeleteDb.delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'DeleteDb.cancel',
    defaultMessage: 'Cancel',
  },
  deleted: {
    id: 'DeleteDb.deleted',
    defaultMessage: 'Data deleted',
  },
})
