import { Online } from '@ag/online'
import { ApolloHooksProvider } from '@ag/util'
import ApolloClient from 'apollo-client'
import crypto from 'crypto'
import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import {
  ClientDependencies,
  CoreContext,
  CoreStoreContext,
  IntlContext,
  OnlineContext,
} from './context'
import { CoreStore } from './reducers'

const log = debug('core:app')

type Props = React.PropsWithChildren<{
  client: ApolloClient<any>
  intl: IntlContext
  store: CoreStore
  context: CoreContext
  online: Online
}>

const uniqueId = () => {
  return (
    'a' +
    crypto //
      .randomBytes(16)
      .toString('hex')
  )
}

interface CreateContextParams {
  store: CoreStore
  deps: ClientDependencies
}
export const createContext = ({ deps }: CreateContextParams): CoreContext => {
  const context: CoreContext = {
    uniqueId,
    ...deps,
  }

  return context
}

export const App = Object.assign(
  React.memo<Props>(({ context, client, store, online, intl, children }) => {
    return (
      <OnlineContext.Provider value={online}>
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            <CoreStoreContext.Provider value={store}>
              <IntlContext.Provider value={intl}>
                <CoreContext.Provider value={context}>
                  {/* tslint:disable-next-line:prettier */}
                  {children}
                </CoreContext.Provider>
              </IntlContext.Provider>
            </CoreStoreContext.Provider>
          </ApolloHooksProvider>
        </ApolloProvider>
      </OnlineContext.Provider>
    )
  }),
  {
    createContext,
  }
)
