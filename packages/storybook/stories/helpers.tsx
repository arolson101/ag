// tslint:disable:no-implicit-dependencies
import { actions, CoreAction } from '@ag/core/actions'
import { App } from '@ag/core/app'
import { CoreDependencies, SystemCallbacks } from '@ag/core/context'
import { coreEpics } from '@ag/core/epics'
import { coreReducers, CoreState, CoreStore, selectors } from '@ag/core/reducers'
import { online } from '@ag/online'
import { action } from '@storybook/addon-actions'
import { MockedResponse } from 'apollo-link-mock'
import debug from 'debug'
import React, { useEffect, useRef, useState } from 'react'
import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
// import 'sql.js'
import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import { storiesOf, ui } from './platform-specific'

export { MockedResponse }
export { action, storiesOf }

import minimal from './data/minimal.xlsx'

const empty = minimal
const maximal = minimal

export const data = {
  bankId: 'cjrbfiy580000415s2ibuxm2c',
  accountId: 'cjrbhh3dw0000415s5awimr3f',
}

const log = debug('helpers')

const initSqlJs = require('sql.js/dist/sql-asm.js')
initSqlJs().then((x: SQLJS) => (window.SQL = x))

export const forever = 2 ** 31 - 1

export const addDelay = (responses: MockedResponse[], delay: number) => {
  return responses.map(r => ({ ...r, delay }))
}

const createStore = (dependencies: CoreDependencies) => {
  const epicMiddleware = createEpicMiddleware<CoreAction, CoreAction, CoreState, CoreDependencies>({
    dependencies,
  })

  const middleware = [
    epicMiddleware, //
  ]

  const store = reduxCreateStore<CoreState, CoreAction, {}, {}>(
    combineReducers(coreReducers),
    composeWithDevTools(applyMiddleware(...middleware))
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

  const type = 'sqljs'
  // log('opening %s', name)
  const db = await createConnection({
    name,
    type,
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

type Dataset = 'empty' | 'normal' | 'full'

export const MockApp: React.FC<{ dataset?: Dataset }> = ({ dataset, children }) => {
  const store = useRef<CoreStore | undefined>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (window.SQL) {
      // log('create store')
      store.current = createStore({ sys, online, ui })
      store.current.dispatch(actions.init())

      waitForState(store.current!, selectors.isDbInitialized) //
        .then(async () => {
          // log('initialized')
          // if (dataset)
          {
            store.current!.dispatch(actions.dbCreate({ name: 'app', password: '1234' }))
            await waitForState(store.current!, selectors.isLoggedIn) //
            // log('logged in')
            setIsLoggedIn(true)
          }
        })
    }
  }, [store, window.SQL])

  if (!store.current) {
    return <div>initializing...</div>
  }

  if (!isLoggedIn) {
    return <div>logging in...</div>
  }

  return <App {...{ sys, ui, store: store.current, online }}>{children}</App>
}
