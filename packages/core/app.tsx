import crypto from 'crypto'
import debug from 'debug'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { AppContext, ClientDependencies } from './context'
import { AppStore } from './reducers'

const log = debug('core:app')

export namespace App {
  export interface Props {
    context: AppContext
  }
}

export class App extends React.PureComponent<App.Props> {
  render() {
    const { context, children } = this.props

    return (
      <Provider store={context.store}>
        <AppContext.Provider value={context}>
          {/* tslint:disable-next-line:prettier */}
            {children}
        </AppContext.Provider>
      </Provider>
    )
  }
}

const uniqueId = () => {
  return crypto.randomBytes(16).toString('base64')
}

export namespace App {
  interface CreateContextParams {
    store: AppStore
    deps: ClientDependencies
  }
  export const createContext = ({ store, deps }: CreateContextParams): AppContext => {
    const { dispatch, getState } = store
    const { intl } = new IntlProvider({ locale: 'en' }).getChildContext()

    const context: AppContext = {
      uniqueId,
      store,
      dispatch,
      getState,
      intl,
      ...deps,
    }

    return context
  }
}
