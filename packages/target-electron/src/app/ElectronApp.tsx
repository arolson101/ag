import { actions } from '@ag/core/actions'
import { App } from '@ag/core/app'
import { CoreStore, selectors } from '@ag/core/reducers'
import { createClient } from '@ag/db'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import electron from 'electron'
import React from 'react'
import { MenuItem, Provider, WindowMenu } from 'react-electron-menu'
import { hot } from 'react-hot-loader/root'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronRouter } from './ElectronRouter'
import { init } from './menu'
import { deleteDb, openDb } from './openDb.electron'
import { sys } from './store'

interface Props {
  store: CoreStore
  hist: HistoryType
}

class ElectronApp extends React.PureComponent<Props> {
  render() {
    const { store, hist } = this.props
    const client = createClient(() => ({
      isLoggedIn: () => selectors.isLoggedIn(store.getState()),
      getAppDb: () => selectors.getAppDb(store.getState()),
      store,
      online,
      intl: selectors.getIntl(store.getState()),
      openDb,
      deleteDb,
    }))

    return (
      <Provider electron={electron}>
        <WindowMenu>
          <MenuItem label='File'>
            <MenuItem label='Asdf...' onClick={() => {}} />
          </MenuItem>
        </WindowMenu>

        <App {...{ sys, ui, client, store, online }}>
          <ElectronRouter hist={hist} />
          <ElectronDialogs />
        </App>
      </Provider>
    )
  }

  static start(store: CoreStore) {
    store.dispatch(actions.init())
    // init(store)
  }
}

export default hot(ElectronApp)
