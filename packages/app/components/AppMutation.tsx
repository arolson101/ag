import React from 'react'
import { Mutation, MutationProps } from 'react-apollo'
import { Omit } from 'utility-types'
import { AppContext } from '../context'
import { ErrorDisplay } from './ErrorDisplay'
import { Gql } from './Gql'

interface Props<D, V> extends Omit<MutationProps<D, V>, 'mutation'> {
  mutation: Gql<D, V>
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
      <Mutation<TData, TVariables> {...props} context={this.context}>
        {(fcn, result) => {
          const { loading, error } = result
          if (loading) {
            return <LoadingOverlay show={loading} />
          } else if (error) {
            return <ErrorDisplay error={error} />
          } else {
            return children(fcn, result)
          }
        }}
      </Mutation>
    )
  }
}
