import { App } from '@ag/core/app'
import { SystemCallbacks } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import { createClient } from '@ag/db'
import { online } from '@ag/online'
import debug from 'debug'
import React from 'react'
import { YellowBox } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { iconInit } from '../icons'
import { createStore } from '../store'
import { syncNavState } from '../store/syncNavState'
import { ui } from '../ui'
import { getImageFromLibrary, openCropper, scaleImage } from './image.native'
import { registerComponents, root, setDefaultOptions } from './navigation'
import { deleteDb, openDb } from './openDb.native'

YellowBox.ignoreWarnings(['Remote debugger is in a background tab'])
YellowBox.ignoreWarnings(['Require cycle:'])

const log = debug('rn:init')

export const sys: SystemCallbacks = {
  openDb,
  deleteDb,
  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const store = createStore({ sys, online, ui })
const client = createClient(() => ({
  store,
  online,
  intl: selectors.getIntl(store.getState()),
  openDb,
  deleteDb,
}))

const RnApp: React.FC = ({ children }) => (
  <App {...{ sys, ui, client, store, online }}>{children}</App>
)

registerComponents(RnApp)

Navigation.events().registerAppLaunchedListener(async () => {
  log('app launched')
  setDefaultOptions()
  await iconInit
  log('setting root')
  Navigation.setRoot(root({ store }))
  syncNavState(store)
})
