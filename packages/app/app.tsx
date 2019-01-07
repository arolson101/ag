import { DbImports, initDb } from '@ag/db'
import { configureStore, Dependencies, RootStore } from '@ag/state'
import React from 'react'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { AppContext, UiContext } from './context'
import { LoginPage } from './pages/LoginPage'
import { routeHandlers, routes } from './routes'

interface State {
  store?: RootStore
}

interface Props extends DbImports {
  ui: UiContext
}

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
    const { ui } = this.props

    if (!store) {
      return <>loading...</>
    }

    return (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <GetIntlProvider>
            {intl => (
              <AppContext.Provider value={{ intl, ui }}>
                <LoginPage
                  createDb={() => alert('createDb')}
                  deleteDb={() => alert('deleteDb')}
                  openDb={() => alert('openDb')}
                  allDbs={[]}
                />
              </AppContext.Provider>
            )}
          </GetIntlProvider>
        </IntlProvider>
      </Provider>
    )
  }
}
