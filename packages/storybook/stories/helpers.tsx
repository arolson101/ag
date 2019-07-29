// tslint:disable:no-implicit-dependencies
import { App } from '@ag/core/app'
import { CoreStore, selectors } from '@ag/core/reducers'
import { thunks } from '@ag/core/thunks'
import { importDb } from '@ag/db/export'
import { online } from '@ag/online'
import { action } from '@storybook/addon-actions'
import debug from 'debug'
import React, { useEffect, useState } from 'react'
import empty from './data/empty.agz'
import full from './data/full.agz'
import normal from './data/normal.agz'
import { storiesOf, ui } from './platform-specific'
import { createStore, sys, waitForState } from './storybookStore'

export { action, storiesOf }

require('sql.js/dist/sql-asm.js')().then((x: SQLJS) => (window.SQL = x))

const log = debug('storybook:helpers')

const datasets = {
  empty,
  full,
  normal,
}

type Dataset = keyof typeof datasets

export const data = {
  normal: {
    bankId: 'a66d5887b696ceeb594d493f509ef1e25',
    accountId: 'ac847f98eacb81553facf199013ce4446',
    billId: 'a020dd8555b14acc1c1101b2f7d2b8c62',
    transactionId: 'a4737047481961dad74575ee85b745f7d',
  },
  full: {
    bankId: 'a74780f9d696f3646f3177b83093c0667',
    accountId: 'a13cb3bf09d932e0b00d4eedee1b22e85',
    billId: 'a020dd8555b14acc1c1101b2f7d2b8c62',
    transactionId: '',
  },
}

export const MockApp: React.FC<{ dataset?: Dataset }> = ({ dataset, children }) => {
  const [store, setStore] = useState<CoreStore | undefined>(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { Text } = ui

  useEffect(() => {
    if (window.SQL) {
      // log('create store')
      const s = createStore({ ui, online, sys })
      s.dispatch(thunks.init())

      setStore(s)

      waitForState(s, selectors.isDbInitialized) //
        .then(async () => {
          // log('initialized')
          if (dataset) {
            s.dispatch(thunks.dbCreate({ name: 'app', password: '1234' }))
            await waitForState(s, selectors.isLoggedIn)
            const { connection } = selectors.appDb(s.getState())
            await importDb(connection, Buffer.from(datasets[dataset]))
            await s.dispatch(thunks.dbReloadAll())
            // log('logged in')
            setIsLoggedIn(true)
          }
        })
    }
  }, [window.SQL])

  if (!store) {
    return <Text>initializing...</Text>
  }

  if (dataset && !isLoggedIn) {
    return <Text>logging in...</Text>
  }

  return <App {...{ sys, ui, store, online }}>{children}</App>
}
