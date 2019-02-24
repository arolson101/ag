import { App, ClientDependencies } from '@ag/app'
import { createClient } from '@ag/lib-db'
import { rnfetch } from '@ag/react-native-fetch'
import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { YellowBox } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { iconInit } from '../icons'
import { store } from '../store'
import { ui } from '../ui'
import { getImageFromLibrary, openCropper, scaleImage } from './image.native'
import { registerComponents, root, setDefaultOptions } from './navigation'
import { deleteDb, openDb } from './openDb.native'

YellowBox.ignoreWarnings(['Remote debugger is in a background tab'])
YellowBox.ignoreWarnings(['Require cycle:'])

const log = debug('rn:init')
log.enabled = true

export const deps: ClientDependencies = {
  ui,

  fetch: rnfetch,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const client = createClient({ openDb, deleteDb })
const context = App.createContext({ store, deps })

const RnApp: React.FC = ({ children }) => (
  <ApolloProvider client={client}>
    <App context={context}>{children}</App>
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
