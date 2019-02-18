import { App, ClientDependencies } from '@ag/app'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { store } from '../store'
import { ui } from '../ui'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronRouter } from './ElectronRouter'
import { getImageFromLibrary, openCropper, scaleImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

export const dependencies: ClientDependencies = {
  ui,

  openDb,
  deleteDb,
  fetch,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const context = App.createContext(store, dependencies)

class ElectronApp extends React.PureComponent {
  render() {
    return (
      <App context={context}>
        <ElectronRouter />
        <ElectronDialogs />
      </App>
    )
  }
}

export default hot(ElectronApp)
