import { Db } from '@ag/db'
import {
  AccountRepository,
  BankRepository,
  DbRepository,
  SettingsRepository,
  TransactionRepository,
} from '@ag/db/repositories'
import { Connection } from 'typeorm'
import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'

export interface DbState {
  index?: {
    connection: Connection
    dbRepository: DbRepository
    dbs: DbInfo[]
  }
  indexError?: Error
  appError?: Error
  app?: {
    connection: Connection
    settingsRepository: SettingsRepository
    banksRepository: BankRepository
    accountsRepository: AccountRepository
    transactionsRepository: TransactionRepository
  }
}

const defaultState: DbState = {}

export const dbSelectors = {
  isDbInitializing: (state: DbState) => !state.index && !state.indexError,
  isDbInitialized: (state: DbState) => !!state.index,
  getIndexDb: (state: DbState) => state.index,
  getDbs: (state: DbState) => (state.index ? state.index.dbs : []),
  getDbRepository: (state: DbState) => {
    if (!state.index) {
      throw new Error('index db not open')
    }
    return state.index.dbRepository
  },
  getIndexError: (state: DbState) => state.indexError,

  isLoggedIn: (state: DbState) => !!state.app,
  getAppDb: (state: DbState) => {
    if (!state.app) {
      throw new Error('app db not open')
    }
    return state.app
  },
  getAppError: (state: DbState) => state.appError,
  getSettingsRepository: (state: DbState) => {
    if (!state.app) {
      throw new Error('app db not open')
    }
    return state.app.settingsRepository
  },
}

export const db = (state: DbState = defaultState, action: CoreAction): DbState => {
  switch (action.type) {
    case getType(actions.dbInit.request):
      return { ...state, index: undefined, indexError: undefined }

    case getType(actions.dbInit.success): {
      const { connection, dbs } = action.payload
      return {
        ...state,
        index: {
          connection, //
          dbs,
          dbRepository: connection.getRepository(Db),
        },
      }
    }

    case getType(actions.dbInit.failure):
      return { ...state, indexError: action.payload }

    case getType(actions.dbCreate.request):
    case getType(actions.dbLogin.request):
    case getType(actions.dbLogout):
      return { ...state, app: undefined, appError: undefined }

    case getType(actions.dbCreate.success):
    case getType(actions.dbLogin.success): {
      if (!state.index) {
        throw new Error('index db not open')
      }
      const { connection } = action.payload
      const dbs =
        action.type === getType(actions.dbCreate.success) //
          ? action.payload.dbs
          : state.index.dbs
      return {
        ...state,
        app: {
          connection,
          settingsRepository: connection.getCustomRepository(SettingsRepository),
          banksRepository: connection.getCustomRepository(BankRepository),
          accountsRepository: connection.getCustomRepository(AccountRepository),
          transactionsRepository: connection.getCustomRepository(TransactionRepository),
        },
        index: {
          ...state.index,
          dbs,
        },
      }
    }

    case getType(actions.dbCreate.failure):
    case getType(actions.dbLogin.failure):
      return { ...state, appError: action.payload }

    case getType(actions.dbDelete.success):
      if (!state.index) {
        throw new Error('index db not open')
      }
      return { ...state, index: { ...state.index, dbs: action.payload.dbs } }

    default:
      return state
  }
}
