import { App, ClientDependencies } from '@ag/app'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { store } from '../store'
import { ui } from '../ui'
import { Dialogs } from './Dialogs'
import { ElectronRouter } from './ElectronRouter'
import { resizeImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

export const dependencies: ClientDependencies = {
  ui,

  openDb,
  deleteDb,
  fetch,

  getImageFromLibrary: null as any,
  resizeImage,
}

const context = App.createContext(store, dependencies)

class ElectronApp extends React.PureComponent {
  render() {
    return (
      <App context={context}>
        <ElectronRouter />
        <Dialogs />
      </App>
    )
  }
}

export default hot(ElectronApp)
