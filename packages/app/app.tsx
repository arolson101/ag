import ApolloClient from 'apollo-client'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Dialogs } from './components'
import { AppContext, UiContext } from './context'
import { routes } from './pages'
import { AppStore } from './reducers'

interface Props {
  client: ApolloClient<any>
  ui: UiContext
  store: AppStore
}

interface GetIntlProviderProps {
  children: (intl: InjectedIntl) => React.ReactNode
}
const GetIntlProvider = injectIntl<GetIntlProviderProps>(({ intl, children }) => (
  <>{children(intl)}</>
))
GetIntlProvider.WrappedComponent.displayName = 'GetIntlProvider'

export class App extends React.PureComponent<Props> {
  componentDidMount() {
    const { store } = this.props
    // store.dispatch(nav.login({}))
  }

  render() {
    const { client, store, ui } = this.props
    const { Router } = ui

    if (!store) {
      return <>loading...</>
    }

    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <IntlProvider locale='en'>
            <GetIntlProvider>
              {intl => (
                <AppContext.Provider value={{ client, intl, ui }}>
                  <Router routes={routes} />
                  <Dialogs />
                </AppContext.Provider>
              )}
            </GetIntlProvider>
          </IntlProvider>
        </Provider>
      </ApolloProvider>
    )
  }
}
