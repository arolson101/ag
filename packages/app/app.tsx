import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { GetIntlProvider, IsLoggedIn } from './components'
import { AppContext, ClientDependencies } from './context'
import { client } from './db'
import { ApolloClientContextProvider } from './db/ApolloClientContextProvider'
import { Dialogs } from './dialogs'
import { AppStore } from './reducers'

const log = debug('app:app')
log.enabled = true

export namespace App {
  export interface Props extends ClientDependencies {
    store: AppStore
    children: (isLoggedIn: boolean) => JSX.Element
  }
}

export class App extends React.PureComponent<App.Props> {
  render() {
    log('App: %o', this.props)
    const { store, children, ...props } = this.props
    const { dispatch, getState } = store

    return (
      <ApolloProvider client={client}>
        <IntlProvider locale='en'>
          <GetIntlProvider>
            {intl => (
              <Provider store={store}>
                <AppContext.Provider
                  value={{
                    client,
                    intl,
                    dispatch,
                    getState,
                    ...props,
                  }}
                >
                  <ApolloClientContextProvider>
                    <IsLoggedIn>{isLoggedIn => children(isLoggedIn)}</IsLoggedIn>
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
