import debug from 'debug'
import React from 'react'
import { Query, QueryProps } from 'react-apollo'
import { Omit } from 'utility-types'
import { AppContext } from '../context'
import { ErrorDisplay } from './ErrorDisplay'
import { Gql } from './Gql'

const log = debug('app:AppQuery')
log.enabled = true

interface Props<D, V> extends Omit<QueryProps<D, V>, 'query' | 'children'> {
  query: Gql<D, V>
  children: (data: D) => React.ReactNode
}

export class AppQuery<TData, TVariables> extends React.PureComponent<Props<TData, TVariables>> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { children, ...props } = this.props
    const {
      ui: { LoadingOverlay },
    } = this.context

    return (
      <Query<TData, TVariables> {...props}>
        {({ loading, error, data }) => {
          if (loading) {
            return <LoadingOverlay show={loading} />
          } else if (error) {
            log('error: %s (%O)', error.message, error)
            return <ErrorDisplay error={error} />
          } else {
            return children(data!)
          }
        }}
      </Query>
    )
  }
}
