import { OperationVariables } from 'apollo-client'
import {
  MutationFn,
  MutationHookOptions,
  useApolloClient,
  useMutation as useHookMutation,
} from 'react-apollo-hooks'
import { Gql } from './Gql'
export { useApolloClient, MutationFn }

export function useMutation<TData, TVariables = OperationVariables, TCache = object>(
  mutation: Gql<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables, TCache> = {}
) {
  return useHookMutation(mutation, options)
}
