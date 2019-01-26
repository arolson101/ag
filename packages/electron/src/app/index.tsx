import { App } from '@ag/app'
import axios from 'axios'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { store } from '../store'
import { ui } from '../ui'
import { deleteDb, openDb } from './openDb.electron'

export const appProps: App.Props = {
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
    return <App {...appProps} />
  }
}

export default hot(ElectronApp)
