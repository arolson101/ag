import { Gql } from '@ag/util'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { IntlContext } from '../context'
import { UiContext } from '../context/uiContext'
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
  intl: IntlContext
  dbId: string
  ui: UiContext
}

export const deleteDb = ({ client, ui, intl, dbId }: DeleteDbParams) => {
  const { alert, showToast } = ui

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
        update: () => {
          client.reFetchObservableQueries()
        },
      })

      ErrorDisplay.show(ui, intl, result.errors)
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
