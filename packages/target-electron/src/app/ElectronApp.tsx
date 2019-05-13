import { actions } from '@ag/core/actions'
import { App } from '@ag/core/app'
import { CoreStore, selectors } from '@ag/core/reducers'
import { createClient } from '@ag/db'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronRouter } from './ElectronRouter'
import { init } from './export'
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
      store,
      online,
      intl: selectors.getIntl(store.getState()),
      openDb,
      deleteDb,
    }))

    return (
      <App {...{ sys, ui, client, store, online }}>
        <ElectronRouter hist={hist} />
        <ElectronDialogs />
      </App>
    )
  }

  static start(store: CoreStore) {
    store.dispatch(actions.init())
    init(store)
  }
}

export default hot(ElectronApp)
