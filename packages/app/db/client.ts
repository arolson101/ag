import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink, FetchResult, NextLink, Observable, Operation } from 'apollo-link'
import debug from 'debug'
import { execute } from 'graphql'
import { AppContext } from '../context'
import { schema } from './schema'

const log = debug('app:client')
log.enabled = false // process.env.NODE_ENV !== 'production'

export class ExecuteLink extends ApolloLink {
  static context: AppContext

  request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
    return new Observable(observer => {
      log('ExecuteLink %o', { operation, context: ExecuteLink.context })
      Promise.resolve(
        execute({
          schema,
          document: operation.query,
          variableValues: operation.variables,
          operationName: operation.operationName,
          contextValue: ExecuteLink.context,
        })
      )
        .then(data => {
          log('success %o', data)
          observer.next(data)
          observer.complete()
        })
        .catch(error => {
          log('error %o', error)
          observer.error(error)
        })
    })
  }
}

export const client = new ApolloClient({
  link: new ExecuteLink(),
  cache: new InMemoryCache(),
})
