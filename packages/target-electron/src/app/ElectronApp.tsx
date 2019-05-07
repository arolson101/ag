import { App, SystemCallbacks } from '@ag/core'
import { createClient } from '@ag/db'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { IntlProvider } from 'react-intl'
import { createStore } from '../store'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronRouter } from './ElectronRouter'
import { init } from './export'
import { getImageFromLibrary, openCropper, scaleImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

export const sys: SystemCallbacks = {
  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const { intl } = new IntlProvider({ locale: 'en' }).getChildContext()
const store = createStore(sys)
const client = createClient({ openDb, deleteDb, online, intl })

class ElectronApp extends React.PureComponent {
  render() {
    return (
      <App {...{ sys, ui, client, intl, store, online }}>
        <ElectronRouter />
        <ElectronDialogs />
      </App>
    )
  }
}

init()

export default hot(ElectronApp)
