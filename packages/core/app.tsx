import { Online } from '@ag/online'
import { ApolloHooksProvider } from '@ag/util'
import ApolloClient from 'apollo-client'
import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import {
  CoreStoreContext,
  IntlContext,
  OnlineContext,
  SystemCallbacks,
  SystemContext,
  UiContext,
} from './context'
import { CoreStore } from './reducers'

const log = debug('core:app')

type Props = React.PropsWithChildren<{
  client: ApolloClient<any>
  intl: IntlContext
  store: CoreStore
  online: Online
  ui: UiContext
  sys: SystemCallbacks
}>

export const App = Object.assign(
  React.memo<Props>(({ client, sys, store, ui, online, intl, children }) => {
    return (
      <SystemContext.Provider value={sys}>
        <UiContext.Provider value={ui}>
          <OnlineContext.Provider value={online}>
            <ApolloProvider client={client}>
              <ApolloHooksProvider client={client}>
                <CoreStoreContext.Provider value={store}>
                  <IntlContext.Provider value={intl}>
                    {/* tslint:disable-next-line:prettier */}
                    {children}
                  </IntlContext.Provider>
                </CoreStoreContext.Provider>
              </ApolloHooksProvider>
            </ApolloProvider>
          </OnlineContext.Provider>
        </UiContext.Provider>
      </SystemContext.Provider>
    )
  }),
  {
    displayName: 'App',
  }
)
