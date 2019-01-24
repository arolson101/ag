import React from 'react'
import { Mutation, MutationFn, MutationProps, MutationResult } from 'react-apollo'
import { Omit } from 'utility-types'
import { AppContext } from '../context'
import { ErrorDisplay } from './ErrorDisplay'
import { Gql } from './Gql'

interface Props<D, V> extends Omit<MutationProps<D, V>, 'mutation' | 'children'> {
  mutation: Gql<D, V>
  children: (
    mutateFn: MutationFn<D, V>,
    result: Omit<MutationResult<D>, 'error' | 'loading'>
  ) => React.ReactNode
}

export class AppMutation<TData, TVariables> extends React.PureComponent<Props<TData, TVariables>> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { children, ...props } = this.props
    const {
      ui: { LoadingOverlay },
    } = this.context

    return (
      <Mutation<TData, TVariables> {...props}>
        {(fcn, result) => {
          const { loading, error } = result
          return (
            <>
              <LoadingOverlay show={loading} />
              {error && <ErrorDisplay error={error} />}
              {children(fcn, result)}
            </>
          )
        }}
      </Mutation>
    )
  }
}
