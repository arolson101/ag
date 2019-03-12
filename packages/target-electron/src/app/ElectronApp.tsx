import { App, ClientDependencies } from '@ag/core'
import { createClient } from '@ag/db'
import { ui } from '@ag/ui-antd'
import axios from 'axios'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { hot } from 'react-hot-loader/root'
import { store } from '../store'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronRouter } from './ElectronRouter'
import { getImageFromLibrary, openCropper, scaleImage } from './image.electron'
import { deleteDb, openDb } from './openDb.electron'

export const deps: ClientDependencies = {
  ui,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const context = App.createContext({ store, deps })
const client = createClient({ openDb, deleteDb, axios, ...context })

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

export default hot(ElectronApp)
