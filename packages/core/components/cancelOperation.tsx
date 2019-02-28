import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import * as T from '../graphql-types'
import { Gql } from './Gql'

export const cancelOperation = (client: ApolloClient<any>, cancelToken: string) => {
  return client.mutate<T.Cancel.Mutation, T.Cancel.Variables>({
    mutation: cancelOperation.mutations.cancel,
    variables: { cancelToken },
  })
}

cancelOperation.mutations = {
  cancel: gql`
    mutation Cancel($cancelToken: String!) {
      cancel(cancelToken: $cancelToken)
    }
  ` as Gql<T.Cancel.Mutation, T.Cancel.Variables>,
}
