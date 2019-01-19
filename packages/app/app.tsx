import ApolloClient from 'apollo-client'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { AppContext, UiContext } from './context'
import { AppStore } from './reducers'
import { routes } from './routes'

interface Props {
  client: ApolloClient<any>
  store: AppStore
  ui: UiContext
}

interface GetIntlProviderProps {
  children: (intl: InjectedIntl) => React.ReactNode
}
const GetIntlProvider = injectIntl<GetIntlProviderProps>(({ intl, children }) => (
  <>{children(intl)}</>
))
GetIntlProvider.WrappedComponent.displayName = 'GetIntlProvider'

interface State {
  client?: ApolloClient<any>
}

export class App extends React.PureComponent<Props> {
  render() {
    const { client, store, ui } = this.props
    const { Router } = ui
    const dispatch = store.dispatch

    if (!client) {
      return null
      // throw new Error('no client')
    }

    return (
      <ApolloProvider client={client}>
        <IntlProvider locale='en'>
          <GetIntlProvider>
            {intl => (
              <Provider store={store}>
                <AppContext.Provider value={{ client, intl, ui, dispatch }}>
                  <Router routes={routes} />
                  {/* <Dialogs /> */}
                </AppContext.Provider>
              </Provider>
            )}
          </GetIntlProvider>
        </IntlProvider>
      </ApolloProvider>
    )
  }
}
