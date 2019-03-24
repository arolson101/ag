import crypto from 'crypto'
import debug from 'debug'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ClientDependencies, CoreContext } from './context'
import { CoreStore } from './reducers'

const log = debug('core:app')

type Props = React.PropsWithChildren<{
  context: CoreContext
}>

const uniqueId = () => {
  return (
    'a' +
    crypto
      .randomBytes(16)
      .toString('base64')
      .replace('==', '')
  )
}

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

export const App = Object.assign(
  React.memo<Props>(({ context, children }) => {
    return (
      <Provider store={context.store}>
        <CoreContext.Provider value={context}>
          {/* tslint:disable-next-line:prettier */}
          {children}
        </CoreContext.Provider>
      </Provider>
    )
  }),
  {
    createContext,
  }
)
