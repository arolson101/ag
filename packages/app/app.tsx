import ApolloClient from 'apollo-client'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { actions } from './actions'
import { Dialogs } from './components'
import { AppContext, UiContext } from './context'
import { AppStore } from './reducers'
import { routes } from './routes'

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
  render() {
    const { client, ui, store } = this.props
    const { Router } = ui
    const dispatch = store.dispatch

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
