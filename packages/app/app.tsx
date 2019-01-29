import React, { Children } from 'react'
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
    children: (isLoggedIn: boolean) => JSX.Element
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
    const { store, ui, children } = this.props
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
