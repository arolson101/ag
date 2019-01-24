import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Connection, ConnectionOptions } from 'typeorm'
import { IsLoggedIn } from './components'
import { AppContext, UiContext } from './context'
import { client } from './db'
import { ApolloClientContextProvider } from './db/ApolloClientContextProvider'
import { Dialogs } from './dialogs'
import { AppStore } from './reducers'

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
export const GetIntlProvider = injectIntl<GetIntlProviderProps>(({ intl, children }) => (
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
                    <IsLoggedIn>{isLoggedIn => <Router isLoggedIn={isLoggedIn} />}</IsLoggedIn>
                    <Dialogs />
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
