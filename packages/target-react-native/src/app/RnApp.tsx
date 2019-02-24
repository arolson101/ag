import { App, ClientDependencies } from '@ag/app'
import { rnfetch } from '@ag/react-native-fetch'
import debug from 'debug'
import React from 'react'
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

export const dependencies: ClientDependencies = {
  ui,

  openDb,
  deleteDb,
  fetch: rnfetch,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const context = App.createContext(store, dependencies)

const RnApp: React.FC = ({ children }) => <App context={context}>{children}</App>

registerComponents(RnApp)

Navigation.events().registerAppLaunchedListener(async () => {
  log('app launched')
  setDefaultOptions()
  await iconInit
  log('setting root')
  Navigation.setRoot(root(context))
})
