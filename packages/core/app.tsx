import { Online } from '@ag/online'
import debug from 'debug'
import React from 'react'
import { Provider as StoreProvider } from 'react-redux'
import { CoreContext, SystemCallbacks, UiContext } from './context'
import { CoreStore } from './reducers'

const log = debug('core:app')

type Props = React.PropsWithChildren<{
  store: CoreStore
  online: Online
  ui: UiContext
  sys: SystemCallbacks
}>

export const App = Object.assign(
  React.memo<Props>(function _App({ sys, store, ui, online, children }) {
    return (
      <CoreContext.Provider value={{ sys, online, ui }}>
        <StoreProvider store={store}>
          {/* tslint:disable-next-line:prettier */}
          {children}
        </StoreProvider>
      </CoreContext.Provider>
    )
  }),
  {
    displayName: 'App',
  }
)
