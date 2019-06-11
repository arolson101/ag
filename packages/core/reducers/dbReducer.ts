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
  }
  dbs: DbInfo[]
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

const defaultState: DbState = {
  dbs: [],
}

export const dbSelectors = {
  isDbInitializing: (state: DbState) => !state.index && !state.indexError,
  isDbInitialized: (state: DbState) => !!state.index,
  getIndexDb: (state: DbState) => state.index,
  getDbs: (state: DbState) => state.dbs,
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
  getConnection: (state: DbState) => state.app && state.app.connection,
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

    case getType(actions.dbInit.success):
      return {
        ...state,
        index: {
          connection: action.payload,
          dbRepository: action.payload.getRepository(Db),
        },
      }

    case getType(actions.dbInit.failure):
      return { ...state, indexError: action.payload }

    case getType(actions.dbLogin.request):
      return { ...state, app: undefined, appError: undefined }

    case getType(actions.dbLogin.success): {
      const connection = action.payload
      return {
        ...state,
        app: {
          connection,
          settingsRepository: connection.getCustomRepository(SettingsRepository),
          banksRepository: connection.getCustomRepository(BankRepository),
          accountsRepository: connection.getCustomRepository(AccountRepository),
          transactionsRepository: connection.getCustomRepository(TransactionRepository),
        },
      }
    }

    case getType(actions.dbLogin.failure):
      return { ...state, appError: action.payload }

    case getType(actions.dbSetInfos):
      return { ...state, dbs: action.payload }

    case getType(actions.dbLogout):
      return { ...state, app: undefined, appError: undefined }

    default:
      return state
  }
}
