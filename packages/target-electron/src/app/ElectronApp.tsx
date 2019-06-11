import { App } from '@ag/core/app'
import { CoreStore } from '@ag/core/reducers'
import { thunks } from '@ag/core/thunks'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronMenu } from './ElectronMenu'
import { ElectronRouter } from './ElectronRouter'
import { sys } from './store'

interface Props {
  store: CoreStore
  hist: HistoryType
}

const ElectronApp = React.memo<Props>(function _ElectronApp(props) {
  const { store, hist } = props

  return (
    <App {...{ sys, ui, store, online }}>
      <ElectronMenu />
      <ElectronRouter hist={hist} />
      <ElectronDialogs />
    </App>
  )
})

export const start = (store: CoreStore) => {
  store.dispatch(thunks.init())
}

export default hot(ElectronApp)
