import { App } from '@ag/app'
import axios from 'axios'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Omit } from 'utility-types'
import { store } from '../store'
import { ui } from '../ui'
import { ElectronRouter } from './ElectronRouter'
import { deleteDb, openDb } from './openDb.electron'

export const appProps: Omit<App.Props, 'children'> = {
  ui,

  openDb,
  deleteDb,
  httpRequest: axios,

  getImageFromLibrary: null as any,
  resizeImage: null as any,

  store,
}

class ElectronApp extends React.PureComponent {
  render() {
    return (
      <App {...appProps}>
        {(
          isLoggedIn //
        ) => <ElectronRouter isLoggedIn={isLoggedIn} />}
      </App>
    )
  }
}

export default hot(ElectronApp)
