import { App, ClientDependencies } from '@ag/app'
import debug from 'debug'
import React from 'react'
import { YellowBox } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { iconInit } from '../icons'
import { store } from '../store'
import { ui } from '../ui'
import { resizeImage } from './image.native'
import { registerComponents, root, setDefaultOptions } from './navigation'
import { deleteDb, openDb } from './openDb.native'

YellowBox.ignoreWarnings(['Remote debugger is in a background tab'])

const log = debug('rn:init')
log.enabled = true

export const dependencies: ClientDependencies = {
  ui,

  openDb,
  deleteDb,
  fetch,

  getImageFromLibrary: null as any,
  resizeImage,
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
