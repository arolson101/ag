import debug from 'debug'
import React from 'react'
import { Query, QueryProps } from 'react-apollo'
import { Omit } from 'utility-types'
import { AppContext } from '../context'
import { ErrorDisplay } from './ErrorDisplay'
import { Gql } from './Gql'

const log = debug('app:AppQuery')

interface Props<D, V> extends Omit<QueryProps<D, V>, 'query' | 'children' | 'onCompleted'> {
  query: Gql<D, V>
  children: (data: D) => React.ReactNode
  onCompleted?: (data: D) => void
}

export class AppQuery<TData, TVariables> extends React.Component<Props<TData, TVariables>> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { children, onCompleted, ...props } = this.props
    const {
      ui: { LoadingOverlay },
    } = this.context
    // log('query %o', props.query)

    return (
      <Query<TData, TVariables> {...props} onCompleted={onCompleted as any}>
        {({ loading, error, data }) => (
          <>
            <LoadingOverlay
              show={loading}
              title={`query(${(props.query.definitions[0] as any).name.value})`}
            />
            {error && <ErrorDisplay error={error} />}
            {!loading && children(data!)}
          </>
        )}
      </Query>
    )
  }
}
