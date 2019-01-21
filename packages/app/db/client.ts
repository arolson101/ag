import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink, FetchResult, NextLink, Observable, Operation } from 'apollo-link'
import debug from 'debug'
import { execute } from 'graphql'
import { ApolloClientContextProvider } from './ApolloClientContextProvider'
import { schema } from './schema'

const log = debug('app:client')
log.enabled = false // process.env.NODE_ENV !== 'production'

class ExecuteLink extends ApolloLink {
  request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
    return new Observable(observer => {
      log('ExecuteLink %o', operation)
      Promise.resolve(
        execute({
          schema,
          document: operation.query,
          variableValues: operation.variables,
          operationName: operation.operationName,
          contextValue: ApolloClientContextProvider.cachedContext,
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
