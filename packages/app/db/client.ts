import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink, FetchResult, NextLink, Observable, Operation } from 'apollo-link'
import debug from 'debug'
import { execute } from 'graphql'
import Container from 'typedi'
import { DbImports, DbImportsService } from '../services'
import { schema } from './schema'

export { DbImports }

const log = debug('app:client')

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
          contextValue: operation.getContext(),
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

export const initClient = (imports: DbImports) => {
  Container.set(DbImportsService, new DbImportsService(imports))
  const client = new ApolloClient({
    link: new ExecuteLink(),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })
  return client
}
