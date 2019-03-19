import crypto from 'crypto'
import debug from 'debug'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ClientDependencies, CoreContext } from './context'
import { CoreStore } from './reducers'

const log = debug('core:app')

export namespace App {
  export interface Props {
    context: CoreContext
  }
}

export class App extends React.PureComponent<App.Props> {
  render() {
    const { context, children } = this.props

    return (
      <Provider store={context.store}>
        <CoreContext.Provider value={context}>
          {/* tslint:disable-next-line:prettier */}
            {children}
        </CoreContext.Provider>
      </Provider>
    )
  }
}

const uniqueId = () => {
  return crypto.randomBytes(16).toString('base64')
}

export namespace App {
  interface CreateContextParams {
    store: CoreStore
    deps: ClientDependencies
  }
  export const createContext = ({ store, deps }: CreateContextParams): CoreContext => {
    const { dispatch, getState } = store
    const { intl } = new IntlProvider({ locale: 'en' }).getChildContext()

    const context: CoreContext = {
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
