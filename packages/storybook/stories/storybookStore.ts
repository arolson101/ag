// tslint:disable:no-implicit-dependencies
import { CoreAction } from '@ag/core/actions'
import { CoreDependencies, SystemCallbacks } from '@ag/core/context'
import { coreReducers, CoreState, CoreStore } from '@ag/core/reducers'
import { action } from '@storybook/addon-actions'
import debug from 'debug'
import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'

const log = debug('storybook:storybookStore')

export const createStore = (deps: CoreDependencies): CoreStore => {
  const store = reduxCreateStore<CoreState, CoreAction, {}, {}>(
    combineReducers(coreReducers),
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(deps)))
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

export const sys: SystemCallbacks = {
  openDb,
  deleteDb: action('deleteDb') as any,
  scaleImage: async (image, scale) => image,
  openCropper: action('openCropper') as any,
  getImageFromLibrary: action('getImageFromLibrary') as any,
}

export const waitForState = (store: CoreStore, finished: (state: CoreState) => boolean) =>
  new Promise<any>((resolve, reject) => {
    if (finished(store.getState())) {
      resolve()
    }
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      log('store update: %o', state)
      if (finished(state)) {
        log('finished')
        unsubscribe()
        resolve()
      }
    })
  })
