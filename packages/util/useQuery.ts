import { OperationVariables } from 'apollo-client'
import {
  ApolloProvider as ApolloHooksProvider,
  QueryHookOptions,
  QueryHookResult,
  useQuery as useHookQuery,
} from 'react-apollo-hooks'
import { Gql } from './Gql'
export { QueryHookResult, ApolloHooksProvider }

export function useQuery<TData, TVariables = OperationVariables, TCache = object>(
  query: Gql<TData, TVariables>,
  options: QueryHookOptions<TVariables, TCache> = {}
) {
  return useHookQuery<TData, TVariables, TCache>(query, options)
}
