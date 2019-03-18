import { OperationVariables } from 'apollo-client'
import { MutationHookOptions, useMutation as useHookMutation } from 'react-apollo-hooks'
import { Gql } from './Gql'

export function useAppMutation<TData, TVariables = OperationVariables, TCache = object>(
  mutation: Gql<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables, TCache> = {}
) {
  return useHookMutation(mutation, options)
}
