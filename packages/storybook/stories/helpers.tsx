// tslint:disable:no-implicit-dependencies
import { actions, CoreAction } from '@ag/core/actions'
import { App } from '@ag/core/app'
import { CoreDependencies, SystemCallbacks } from '@ag/core/context'
import { coreEpics } from '@ag/core/epics'
import { coreReducers, CoreState, CoreStore, selectors } from '@ag/core/reducers'
import { importDb } from '@ag/db/export'
import { online } from '@ag/online'
import { action } from '@storybook/addon-actions'
import debug from 'debug'
import React, { useEffect, useState } from 'react'
import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import empty from './data/empty.xlsx'
import full from './data/full.xlsx'
import normal from './data/normal.xlsx'
import { storiesOf, ui } from './platform-specific'

export { action, storiesOf }

require('sql.js/dist/sql-asm.js')().then((x: SQLJS) => (window.SQL = x))

export const data = {
  normal: {
    bankId: 'a372cda0d53a2f9b0f4c46d0cd3136748',
    accountId: 'a30cdcfe7d083e8e4470e63f61c782928',
  },
  full: {
    bankId: 'a74780f9d696f3646f3177b83093c0667',
    accountId: 'a13cb3bf09d932e0b00d4eedee1b22e85',
  },
}

const log = debug('helpers')

type Dataset = 'empty' | 'normal' | 'full'

const datasets: Record<Dataset, XlsxData> = {
  empty,
  normal,
  full,
}

const createStore = (dependencies: CoreDependencies) => {
  const epicMiddleware = createEpicMiddleware<CoreAction, CoreAction, CoreState, CoreDependencies>({
    dependencies,
  })

  const store = reduxCreateStore<CoreState, CoreAction, {}, {}>(
    combineReducers(coreReducers),
    composeWithDevTools(applyMiddleware(epicMiddleware))
  )

  const rootEpic = combineEpics<CoreAction, CoreAction, CoreState, CoreDependencies>(...coreEpics)
  epicMiddleware.run(rootEpic)

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
  scaleImage: action('scaleImage') as any,
  openCropper: action('openCropper') as any,
  getImageFromLibrary: action('getImageFromLibrary') as any,
}

const waitForState = (store: CoreStore, finished: (state: CoreState) => boolean) =>
  new Promise<any>((resolve, reject) => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      if (finished(state)) {
        unsubscribe()
        resolve()
      }
    })
  })

export const MockApp: React.FC<{ dataset?: Dataset }> = ({ dataset, children }) => {
  const [store, setStore] = useState<CoreStore | undefined>(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (window.SQL) {
      // log('create store')
      const s = createStore({ sys, online, ui })
      s.dispatch(actions.init())

      setStore(s)

      waitForState(s, selectors.isDbInitialized) //
        .then(async () => {
          // log('initialized')
          if (dataset) {
            s.dispatch(actions.dbCreate({ name: 'app', password: '1234' }))
            await waitForState(s, selectors.isLoggedIn)
            const { connection } = selectors.getAppDb(s.getState())
            await importDb(connection, datasets[dataset])
            log('logged in')
            setIsLoggedIn(true)
          }
        })
    }
  }, [window.SQL])

  if (!store) {
    return <div>initializing...</div>
  }

  if (dataset && !isLoggedIn) {
    return <div>logging in...</div>
  }

  return <App {...{ sys, ui, store, online }}>{children}</App>
}
