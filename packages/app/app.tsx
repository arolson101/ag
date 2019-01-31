import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { AppContext, ClientDependencies } from './context'
import { client, ExecuteLink } from './db'
import { ApolloClientContextProvider } from './db/ApolloClientContextProvider'
import { Dialogs } from './dialogs'
import { AppStore } from './reducers'

const log = debug('app:app')
log.enabled = true

export namespace App {
  export interface Props {
    context: AppContext
  }
}

export class App extends React.PureComponent<App.Props> {
  render() {
    log('App: %o', this.props)
    const { context, children } = this.props

    return (
      <ApolloProvider client={context.client}>
        <Provider store={context.store}>
          <AppContext.Provider value={context}>
            <ApolloClientContextProvider>
              {children}
              <Dialogs />
            </ApolloClientContextProvider>
          </AppContext.Provider>
        </Provider>
      </ApolloProvider>
    )
  }
}

export namespace App {
  export const createContext = (store: AppStore, deps: ClientDependencies): AppContext => {
    const { dispatch, getState } = store
    const { intl } = new IntlProvider({ locale: 'en' }).getChildContext()

    const context: AppContext = {
      store,
      dispatch,
      getState,
      intl,
      client,
      ...deps,
    }

    ExecuteLink.context = context

    return context
  }
}
