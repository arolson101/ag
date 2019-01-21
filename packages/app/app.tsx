import ApolloClient from 'apollo-client'
import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Connection, ConnectionOptions } from 'typeorm'
import { AppContext, UiContext } from './context'
import { client } from './db'
import { ApolloClientContextProvider } from './db/ContextProvider'
import { AppStore } from './reducers'
import { routes } from './routes'

debug.enable('app:*')

interface Props {
  store: AppStore
  ui: UiContext
  openDb: (
    name: string,
    key: string,
    entities: ConnectionOptions['entities']
  ) => Promise<Connection>
  deleteDb: (name: string) => Promise<void>
}

interface GetIntlProviderProps {
  children: (intl: InjectedIntl) => React.ReactNode
}
const GetIntlProvider = injectIntl<GetIntlProviderProps>(({ intl, children }) => (
  <>{children(intl)}</>
))
GetIntlProvider.WrappedComponent.displayName = 'GetIntlProvider'

export class App extends React.PureComponent<Props> {
  render() {
    const { store, ui, openDb, deleteDb } = this.props
    const { Router } = ui
    const dispatch = store.dispatch
    const getState = store.getState

    return (
      <ApolloProvider client={client}>
        <IntlProvider locale='en'>
          <GetIntlProvider>
            {intl => (
              <Provider store={store}>
                <AppContext.Provider
                  value={{ client, intl, ui, dispatch, getState, openDb, deleteDb }}
                >
                  <ApolloClientContextProvider>
                    <Router routes={routes} />
                    {/* <Dialogs /> */}
                  </ApolloClientContextProvider>
                </AppContext.Provider>
              </Provider>
            )}
          </GetIntlProvider>
        </IntlProvider>
      </ApolloProvider>
    )
  }
}
