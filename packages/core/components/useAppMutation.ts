import { OperationVariables } from 'apollo-client'
import { useState } from 'react'
import {
  BaseMutationHookOptions,
  MutationHookOptions,
  useMutation as useHookMutation,
} from 'react-apollo-hooks'
import { Gql } from './Gql'

type AppMutationHookOptions<TData, TVariables, TCache> = MutationHookOptions<
  TData,
  TVariables,
  TCache
> & {
  onCompleted?: (data: TData | undefined) => any
  onError?: (error: Error) => any
}

export function useAppMutation<TData, TVariables = OperationVariables, TCache = object>(
  mutation: Gql<TData, TVariables>,
  { onCompleted, onError, ...options }: AppMutationHookOptions<TData, TVariables, TCache> = {}
) {
  const [loading, setLoading] = useState<boolean>(false)
  const [called, setCalled] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [data, setData] = useState<TData | undefined>(undefined)

  const mutate = useHookMutation(mutation, options)

  const handler = async (handlerOptions?: BaseMutationHookOptions<TData, TVariables>) => {
    setLoading(true)
    setCalled(true)
    setError(undefined)
    setData(undefined)

    try {
      const { data: result } = await mutate(handlerOptions)

      setData(result)

      setLoading(false)

      if (onCompleted) {
        onCompleted(result)
      }

      return { data }
    } catch (e) {
      setLoading(false)
      setError(e)

      if (onError) {
        onError(e)
      }
    }
  }

  return [
    handler,
    {
      loading,
      called,
      error,
      data,
    },
  ]
}
