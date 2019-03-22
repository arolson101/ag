import { Gql } from '@ag/util'
import ApolloClient from 'apollo-client'
import debug from 'debug'
import gql from 'graphql-tag'
import * as T from '../graphql-types'

const log = debug('core:cancelOperation')

export const cancelOperation = async (client: ApolloClient<any>, cancelToken: string) => {
  log('cancelOperation %s', cancelToken)
  await client.mutate<T.Cancel.Mutation, T.Cancel.Variables>({
    mutation: cancelOperation.mutations.cancel,
    variables: { cancelToken },
  })
  // log('end %s', cancelToken)
}

cancelOperation.mutations = {
  cancel: gql`
    mutation Cancel($cancelToken: String!) {
      cancel(cancelToken: $cancelToken)
    }
  ` as Gql<T.Cancel.Mutation, T.Cancel.Variables>,
}

export const isCancel = (err: Error) => {
  if (err.message === 'Cancel' || err.message === 'GraphQL error: Cancel') {
    return true
  }
}
