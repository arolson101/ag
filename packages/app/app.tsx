import ApolloClient from 'apollo-client'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { DbImports, initClient } from '../db'
import { AppContext, UiContext } from './context'
import { AppStore } from './reducers'
import { routes } from './routes'

interface Props extends DbImports {
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
  client: ApolloClient<any>
}

export class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    const { openDb, deleteDb } = this.props
    const client = initClient({ openDb, deleteDb })
    this.state = {
      client,
    }
  }

  render() {
    const { store, ui } = this.props
    const { client } = this.state
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
