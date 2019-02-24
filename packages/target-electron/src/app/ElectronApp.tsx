import { App, ClientDependencies } from '@ag/app'
import { createClient } from '@ag/lib-db'
import { ui } from '@ag/ui-blueprint'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { hot } from 'react-hot-loader/root'
import { store } from '../store'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronRouter } from './ElectronRouter'
import { getImageFromLibrary, openCropper, scaleImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

export const deps: ClientDependencies = {
  ui,

  fetch,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const client = createClient({ openDb, deleteDb })
const context = App.createContext({ store, deps })

class ElectronApp extends React.PureComponent {
  render() {
    return (
      <ApolloProvider client={client}>
        <App context={context}>
          <ElectronRouter />
          <ElectronDialogs />
        </App>
      </ApolloProvider>
    )
  }
}

export default hot(ElectronApp)
