import ApolloClient from 'apollo-client'
import debug from 'debug'
import React from 'react'
import { Query, QueryProps } from 'react-apollo'
import { Omit } from 'utility-types'
import { CoreContext } from '../context'
import { ErrorDisplay } from './ErrorDisplay'
import { Gql } from './Gql'

const log = debug('core:AppQuery')

interface Props<D, V> extends Omit<QueryProps<D, V>, 'query' | 'children' | 'onCompleted'> {
  query: Gql<D, V>
  children: (data: D, client: ApolloClient<any>) => React.ReactNode
  onCompleted?: (data: D) => void
}

export class AppQuery<TData, TVariables> extends React.Component<Props<TData, TVariables>> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  render() {
    const { children, onCompleted, ...props } = this.props
    const {
      ui: { LoadingOverlay },
    } = this.context
    // log('query %o', props.query)

    return (
      <Query<TData, TVariables> {...props as any} onCompleted={onCompleted as any}>
        {({ loading, error, data, client }) => (
          <>
            <LoadingOverlay
              show={loading}
              title={`query(${(props.query.definitions[0] as any).name.value})`}
            />
            {error && <ErrorDisplay error={error} />}
            {!loading && children(data!, client)}
          </>
        )}
      </Query>
    )
  }
}
