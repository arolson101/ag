import assert from 'assert'
import { Connection, Repository } from 'typeorm'
import { getType } from 'typesafe-actions'
import { actions, AppAction } from '../actions'
import { AccountRepository, BankRepository, Db, TransactionRepository } from '../entities'

export interface DbState {
  indexDb?: {
    connection: Connection
    dbRepository: Repository<Db>
  }
  app?: {
    connection: Connection
    banks: BankRepository
    accounts: AccountRepository
    transactions: TransactionRepository
  }
}

export const dbSelectors = {
  getDbs: (state: DbState) => state.indexDb && state.indexDb.dbRepository,

  getAppDb: (state: DbState) => state.app,

  getAppDbOrFail: (state: DbState) => {
    if (!state.app) {
      throw new Error('app is not open')
    }
    return state.app
  },

  getBanks: (state: DbState) => {
    if (!state.app) {
      throw new Error('app is not open')
    }
    return state.app.banks
  },

  getAccounts: (state: DbState) => {
    if (!state.app) {
      throw new Error('app is not open')
    }
    return state.app.accounts
  },

  getTransactions: (state: DbState) => {
    if (!state.app) {
      throw new Error('app is not open')
    }
    return state.app.transactions
  },
}

const initialState = {}

export const db = (state: DbState = initialState, action: AppAction): DbState => {
  switch (action.type) {
    case getType(actions.openIndex):
      assert(!state.indexDb)
      return {
        ...state,
        indexDb: {
          connection: action.payload,
          dbRepository: action.payload.getRepository(Db),
        },
      }

    case getType(actions.openApp):
      assert(!state.app)
      return {
        ...state,
        app: {
          connection: action.payload,
          banks: action.payload.getCustomRepository(BankRepository),
          accounts: action.payload.getCustomRepository(AccountRepository),
          transactions: action.payload.getCustomRepository(TransactionRepository),
        },
      }

    case getType(actions.closeApp):
      assert(state.app)
      if (state.app) {
        state.app.connection.close()
      }
      return {
        ...state,
        app: undefined,
      }

    default:
      return state
  }
}
