import crypto from 'crypto'
import debug from 'debug'
import React from 'react'
import { Provider } from 'react-redux'
import { ClientDependencies, CoreContext, IntlContext } from './context'
import { CoreStore } from './reducers'

const log = debug('core:app')

type Props = React.PropsWithChildren<{
  intl: IntlContext
  context: CoreContext
}>

const uniqueId = () => {
  return (
    'a' +
    crypto //
      .randomBytes(16)
      .toString('hex')
  )
}

interface CreateContextParams {
  store: CoreStore
  deps: ClientDependencies
}
export const createContext = ({ store, deps }: CreateContextParams): CoreContext => {
  const { dispatch, getState } = store

  const context: CoreContext = {
    uniqueId,
    store,
    dispatch,
    getState,
    ...deps,
  }

  return context
}

export const App = Object.assign(
  React.memo<Props>(({ context, intl, children }) => {
    return (
      <Provider store={context.store}>
        <IntlContext.Provider value={intl}>
          <CoreContext.Provider value={context}>
            {/* tslint:disable-next-line:prettier */}
            {children}
          </CoreContext.Provider>
        </IntlContext.Provider>
      </Provider>
    )
  }),
  {
    createContext,
  }
)
