import { App, selectors, SystemCallbacks } from '@ag/core'
import { createClient } from '@ag/db'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { createStore } from '../store'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronRouter } from './ElectronRouter'
import { init } from './export'
import { getImageFromLibrary, openCropper, scaleImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

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

class ElectronApp extends React.PureComponent {
  render() {
    return (
      <App {...{ sys, ui, client, store, online }}>
        <ElectronRouter />
        <ElectronDialogs />
      </App>
    )
  }
}

init()

export default hot(ElectronApp)
