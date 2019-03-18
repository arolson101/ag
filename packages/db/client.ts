import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink, FetchResult, NextLink, Observable, Operation } from 'apollo-link'
import debug from 'debug'
import { execute } from 'graphql'
import { DbContext } from './DbContext'
import { schema } from './schema'

const log = debug('db:client')

export class ExecuteLink extends ApolloLink {
  constructor(private context: DbContext) {
    super()
  }

  request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
    return new Observable(observer => {
      log('ExecuteLink %o', { operation, context: this.context })
      Promise.resolve(
        execute({
          schema,
          document: operation.query,
          variableValues: operation.variables,
          operationName: operation.operationName,
          contextValue: this.context,
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

export const createClient = (context: DbContext) =>
  new ApolloClient({
    link: new ExecuteLink(context),
    cache: new InMemoryCache(),
  })
