import { createClient } from '@ag/db'
import { Online } from '@ag/online'
import { ApolloHooksProvider } from '@ag/util'
import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider as StoreProvider } from 'react-redux'
import { OnlineContext, SystemCallbacks, SystemContext, UiContext } from './context'
import { CoreStore, selectors } from './reducers'

const log = debug('core:app')

type Props = React.PropsWithChildren<{
  store: CoreStore
  online: Online
  ui: UiContext
  sys: SystemCallbacks
}>

export const App = Object.assign(
  React.memo<Props>(function _App({ sys, store, ui, online, children }) {
    const client = createClient(() => ({
      store,
      online,
      intl: selectors.getIntl(store.getState()),
      openDb: sys.openDb,
      deleteDb: sys.deleteDb,
    }))

    return (
      <SystemContext.Provider value={sys}>
        <UiContext.Provider value={ui}>
          <OnlineContext.Provider value={online}>
            <ApolloProvider client={client}>
              <ApolloHooksProvider client={client}>
                <StoreProvider store={store}>
                  {/* tslint:disable-next-line:prettier */}
                  {children}
                </StoreProvider>
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
