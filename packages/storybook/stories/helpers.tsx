// tslint:disable:no-implicit-dependencies
import { CoreAction } from '@ag/core/actions'
import { App } from '@ag/core/app'
import { CoreDependencies, SystemCallbacks } from '@ag/core/context'
import { coreReducers, CoreState, CoreStore, selectors } from '@ag/core/reducers'
import { thunks } from '@ag/core/thunks'
import { importDb } from '@ag/db/export'
import { online } from '@ag/online'
import { action } from '@storybook/addon-actions'
import debug from 'debug'
import React, { useEffect, useState } from 'react'
import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import empty from './data/empty.zip'
import full from './data/full.zip'
import normal from './data/normal.zip'
import { storiesOf, ui } from './platform-specific'

export { action, storiesOf }

require('sql.js/dist/sql-asm.js')().then((x: SQLJS) => (window.SQL = x))

const log = debug('helpers')

const datasets = {
  empty,
  full,
  normal,
}

type Dataset = keyof typeof datasets

export const data = {
  normal: {
    bankId: 'a372cda0d53a2f9b0f4c46d0cd3136748',
    accountId: 'a30cdcfe7d083e8e4470e63f61c782928',
    billId: 'a020dd8555b14acc1c1101b2f7d2b8c62',
    transactionId: '',
  },
  full: {
    bankId: 'a74780f9d696f3646f3177b83093c0667',
    accountId: 'a13cb3bf09d932e0b00d4eedee1b22e85',
    billId: 'a020dd8555b14acc1c1101b2f7d2b8c62',
    transactionId: '',
  },
}

const createStore = (dependencies: CoreDependencies): CoreStore => {
  const store = reduxCreateStore<CoreState, CoreAction, {}, {}>(
    combineReducers(coreReducers),
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(dependencies)))
  )

  return store
}

const openDb = async (
  name: string,
  key: string,
  entities: ConnectionOptions['entities']
): Promise<Connection> => {
  const mgr = getConnectionManager()
  if (mgr.has(name)) {
    await mgr.get(name).close()
  }

  // log('opening %s', name)
  const db = await createConnection({
    name,
    type: 'sqljs',
    synchronize: true,
    entities,
    // logging: true,
  })
  return db
}

const sys: SystemCallbacks = {
  openDb,
  deleteDb: action('deleteDb') as any,
  scaleImage: async (image, scale) => image,
  openCropper: action('openCropper') as any,
  getImageFromLibrary: action('getImageFromLibrary') as any,
}

const waitForState = (store: CoreStore, finished: (state: CoreState) => boolean) =>
  new Promise<any>((resolve, reject) => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      // log('store update: %o', state)
      if (finished(state)) {
        // log('finished')
        unsubscribe()
        resolve()
      }
    })
  })

export const MockApp: React.FC<{ dataset?: Dataset }> = ({ dataset, children }) => {
  const [store, setStore] = useState<CoreStore | undefined>(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { Text } = ui

  useEffect(() => {
    if (window.SQL) {
      // log('create store')
      const s = createStore({ sys, online, ui })
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
