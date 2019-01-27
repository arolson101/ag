import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { IsLoggedIn } from './components'
import { AppContext, ClientDependencies } from './context'
import { client } from './db'
import { ApolloClientContextProvider } from './db/ApolloClientContextProvider'
import { Dialogs } from './dialogs'
import { AppStore } from './reducers'
import { omit } from './util/omit'

export namespace App {
  export interface Props extends ClientDependencies {
    store: AppStore
  }
}

interface GetIntlProviderProps {
  children: (intl: InjectedIntl) => React.ReactNode
}
export const GetIntlProvider = injectIntl<GetIntlProviderProps>(({ intl, children }) => (
  <>{children(intl)}</>
))
GetIntlProvider.WrappedComponent.displayName = 'GetIntlProvider'

export class App extends React.PureComponent<App.Props> {
  render() {
    const { store, ui } = this.props
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
                  value={{
                    client,
                    intl,
                    dispatch,
                    getState,
                    ...omit(this.props, ['store']),
                  }}
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
