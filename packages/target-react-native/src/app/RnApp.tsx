import { App, ClientDependencies } from '@ag/core'
import { createClient } from '@ag/db'
import { ApolloHooksProvider } from '@ag/util'
import axios from 'axios'
import debug from 'debug'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
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
  axios,
  ui,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const store = createStore(deps)
const context = App.createContext({ store, deps })
const client = createClient({ openDb, deleteDb, axios, ...context })

const RnApp: React.FC = ({ children }) => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <App context={context}>{children}</App>
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
