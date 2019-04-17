import { App, ClientDependencies } from '@ag/core'
import { createClient } from '@ag/db'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import { ApolloHooksProvider } from '@ag/util'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { hot } from 'react-hot-loader/root'
import { createStore } from '../store'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronRouter } from './ElectronRouter'
import { init } from './export'
import { getImageFromLibrary, openCropper, scaleImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

export const deps: ClientDependencies = {
  online,
  ui,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const store = createStore(deps)
const context = App.createContext({ store, deps })
const client = createClient({ openDb, deleteDb, online, ...context })

class ElectronApp extends React.PureComponent {
  render() {
    return (
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <App context={context}>
            <ElectronRouter />
            <ElectronDialogs />
          </App>
        </ApolloHooksProvider>
      </ApolloProvider>
    )
  }
}

init()

export default hot(ElectronApp)
