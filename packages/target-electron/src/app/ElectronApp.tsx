import { App, ClientDependencies } from '@ag/core'
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

export const deps: ClientDependencies = {
  online,
  ui,

  getImageFromLibrary,
  openCropper,
  scaleImage,
}

const { intl } = new IntlProvider({ locale: 'en' }).getChildContext()
const store = createStore(deps)
const context = App.createContext({ store, deps })
const client = createClient({ openDb, deleteDb, online, intl, ...context })

class ElectronApp extends React.PureComponent {
  render() {
    return (
      <App context={context} client={client} intl={intl} store={store}>
        <ElectronRouter />
        <ElectronDialogs />
      </App>
    )
  }
}

init()

export default hot(ElectronApp)
