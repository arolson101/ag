import { DbImports, initDb } from '@ag/db'
import { configureStore, Dependencies, RootStore } from '@ag/state'
import React from 'react'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { AppContext } from './context'
import { routeHandlers, routes } from './routes'

interface State {
  store?: RootStore
}

interface Props extends DbImports {}

interface GetIntlProviderProps {
  children: (intl: InjectedIntl) => React.ReactNode
}
const GetIntlProvider = injectIntl<GetIntlProviderProps>(({ intl, children }) => (
  <>{children(intl)}</>
))
GetIntlProvider.WrappedComponent.displayName = 'GetIntlProvider'

export class App extends React.PureComponent<Props, State> {
  state: State = {}

  componentDidMount() {
    this.init()
  }

  init() {
    const { openDb, deleteDb } = this.props

    const dbImports: DbImports = {
      openDb,
      deleteDb,
    }

    const runQuery = initDb(dbImports)

    const dependencies: Dependencies = {
      runQuery,
    }
    const store = configureStore(routeHandlers, dependencies)

    store.dispatch(routes.login({}))

    this.setState({ store })
  }

  render() {
    const { store } = this.state
    if (!store) {
      return <>loading...</>
    }
    return (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <GetIntlProvider>
            {intl => (
              <AppContext.Provider value={{ intl, ui: null as any }}>
                app with store
              </AppContext.Provider>
            )}
          </GetIntlProvider>
        </IntlProvider>
      </Provider>
    )
  }
}
