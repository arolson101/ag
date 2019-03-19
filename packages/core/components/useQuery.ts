import { OperationVariables } from 'apollo-client'
import { QueryHookOptions, useQuery as useHookQuery } from 'react-apollo-hooks'
import { Gql } from './Gql'

export function useQuery<TData, TVariables = OperationVariables, TCache = object>(
  query: Gql<TData, TVariables>,
  options: QueryHookOptions<TVariables, TCache> = {}
) {
  return useHookQuery<TData, TVariables, TCache>(query, options)
}
