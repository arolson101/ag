import { App } from '@ag/app'
import axios from 'axios'
import debug from 'debug'
import { Root } from 'native-base'
import React from 'react'
import { Navigation } from 'react-native-navigation'
import { Omit } from 'utility-types'
import { iconInit } from '../icons'
import { store } from '../store'
import { ui } from '../ui'
import { registerComponents, root, setDefaultOptions } from './navigation'
import { deleteDb, openDb } from './openDb.native'

const log = debug('rn:init')
log.enabled = true

export const appProps: Omit<App.Props, 'children'> = {
  ui,

  openDb,
  deleteDb,
  httpRequest: axios,

  getImageFromLibrary: null as any,
  resizeImage: null as any,

  store,
} as any

const RnApp: React.FC = ({ children }) => (
  <App {...appProps}>{isLoggedIn => <Root>{children}</Root>}</App>
)

registerComponents(RnApp)

Navigation.events().registerAppLaunchedListener(async () => {
  log('app launched')
  setDefaultOptions()
  await iconInit
  log('setting root')
  Navigation.setRoot(root())
})
