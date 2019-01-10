import { DbImports, initDb } from '@ag/db'
import React from 'react'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { AppContext, UiContext } from './context'
import { routes, routes2 } from './router'
import { configureStore, Dependencies, RootStore } from './state'

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
    const store = configureStore([], dependencies)

    store.dispatch(routes.login({}))

    this.setState({ store })
  }

  render() {
    const { store } = this.state
    const { ui } = this.props
    const { Router } = ui

    if (!store) {
      return <>loading...</>
    }

    return (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <GetIntlProvider>
            {intl => (
              <AppContext.Provider value={{ history, intl, ui }}>
                <Router routes={routes2} />
                {/* <LoginPageComponent
                  submitForm={values => console.log('submit ' + JSON.stringify(values))}
                  deleteDb={() => console.log('deleteDb')}
                  dbId={'123'}
                  data={{ allDbs: [] }}
                /> */}
              </AppContext.Provider>
            )}
          </GetIntlProvider>
        </IntlProvider>
      </Provider>
    )
  }
}
