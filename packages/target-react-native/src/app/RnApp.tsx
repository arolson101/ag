import { App, ClientDependencies } from '@ag/core'
import { createClient } from '@ag/db'
import { online } from '@ag/online'
import { ApolloHooksProvider } from '@ag/util'
import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'
import { YellowBox } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { iconInit } from '../icons'
import { createStore } from '../store'
import { ui } from '../ui'
import { getImageFromLibrary, openCropper, scaleImage } from './image.native'
import { registerComponents, root, setDefaultOptions } from './navigation'
import { deleteDb, openDb } from './openDb.native'

YellowBox.ignoreWarnings(['Remote debugger is in a background tab'])
YellowBox.ignoreWarnings(['Require cycle:'])

const log = debug('rn:init')

export const deps: ClientDependencies = {
  online,
  ui,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const { intl } = new IntlProvider({ locale: 'en' }).getChildContext()
const store = createStore(deps)
const context = App.createContext({ store, deps })
const client = createClient({ openDb, deleteDb, online, intl, ...context })

const RnApp: React.FC = ({ children }) => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <App context={context} intl={intl}>
        {children}
      </App>
    </ApolloHooksProvider>
  </ApolloProvider>
)

registerComponents(RnApp)

Navigation.events().registerAppLaunchedListener(async () => {
  log('app launched')
  setDefaultOptions()
  await iconInit
  log('setting root')
  Navigation.setRoot(root(context))
})
