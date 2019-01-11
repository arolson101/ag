import React from 'react'
import { InjectedIntl, injectIntl, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Dialogs } from './components'
import { AppContext, UiContext } from './context'
import { nav, routes } from './pages'
import { AppStore } from './reducers'

interface Props {
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
    store.dispatch(nav.login({}))
  }

  render() {
    const { store, ui } = this.props
    const { Router } = ui

    if (!store) {
      return <>loading...</>
    }

    return (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <GetIntlProvider>
            {intl => (
              <AppContext.Provider value={{ intl, ui }}>
                <Router routes={routes} />
                <Dialogs />
              </AppContext.Provider>
            )}
          </GetIntlProvider>
        </IntlProvider>
      </Provider>
    )
  }
}
