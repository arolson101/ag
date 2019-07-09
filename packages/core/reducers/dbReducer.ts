import { Db } from '@ag/db'
import {
  AccountRepository,
  BankRepository,
  BillRepository,
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
    billsRepository: BillRepository
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
  indexDb: (state: DbState) => state.index,
  dbs: (state: DbState) => state.dbs,
  dbRepository: (state: DbState) => {
    if (!state.index) {
      throw new Error('index db not open')
    }
    return state.index.dbRepository
  },
  indexError: (state: DbState) => state.indexError,

  isLoggedIn: (state: DbState) => !!state.app,
  appDb: (state: DbState) => {
    if (!state.app) {
      throw new Error('app db not open')
    }
    return state.app
  },
  connection: (state: DbState) => state.app && state.app.connection,
  appError: (state: DbState) => state.appError,
  settingsRepository: (state: DbState) => {
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
          billsRepository: connection.getCustomRepository(BillRepository),
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
