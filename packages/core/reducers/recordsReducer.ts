import { Account, Bank, Record as DbRecord, Transaction } from '@ag/db'
import { stringComparer } from '@ag/util'
import debug from 'debug'
import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'

const log = debug('core:recordsReducer')

interface RecordsState {
  banks: Record<string, Bank>
  accounts: Record<string, Account>
  transactions: Record<string, Transaction>
}

const initialState: RecordsState = {
  banks: {},
  accounts: {},
  transactions: {},
}

export const recordsSelectors = {
  getBanks: (state: RecordsState): Bank[] => {
    const banks = Object.values(state.banks)
    banks.sort((a, b) => stringComparer(a.name, b.name))
    return banks
  },
  getBank: (state: RecordsState, bankId?: string): Bank | undefined => {
    return bankId ? state.banks[bankId] : undefined
  },
  getAccountsForBank: (state: RecordsState, bankId: string): Account[] => {
    const accounts: Account[] = []
    for (const account of Object.values(state.accounts)) {
      if (account.bankId === bankId) {
        accounts.push(account)
      }
    }
    accounts.sort((a, b) => a.sortOrder - b.sortOrder)
    return accounts
  },
  getAccount: (state: RecordsState, accountId?: string): Account | undefined => {
    return accountId ? state.accounts[accountId] : undefined
  },
  getAccounts: (state: RecordsState): Account[] => {
    const accounts = Object.values(state.accounts)
    accounts.sort((a, b) => stringComparer(a.name, b.name))
    return accounts
  },
  getTransactions: (state: RecordsState, accountId: string): Transaction[] => {
    const transactions = Object.values(state.transactions).filter(t => t.accountId === accountId)
    transactions.sort((a, b) => a.time.getTime() - b.time.getTime())
    return transactions
  },
  getTransaction: (state: RecordsState, transactionId?: string): Transaction | undefined => {
    return transactionId ? state.transactions[transactionId] : undefined
  },
}

const applyChange = (
  change: {
    deletes: string[]
    entities: Array<DbRecord<any>>
  },
  state: Record<string, any>
) => {
  const nextState = { ...state }
  if (change.deletes) {
    for (const del of change.deletes) {
      delete nextState[del]
    }
  }
  if (change.entities) {
    for (const entity of change.entities) {
      nextState[entity.id] = entity
    }
  }
  return nextState
}

export const records = (state: RecordsState = initialState, action: CoreAction): RecordsState => {
  switch (action.type) {
    case getType(actions.dbLogin.request):
    case getType(actions.dbLogout):
      return initialState

    case getType(actions.changesWritten): {
      let nextState = state
      for (const change of action.payload) {
        switch (change.table) {
          case Bank:
            nextState = { ...nextState, banks: applyChange(change, nextState.banks) }
            break

          case Account:
            nextState = { ...nextState, accounts: applyChange(change, nextState.accounts) }
            break

          case Transaction:
            nextState = { ...nextState, transactions: applyChange(change, nextState.transactions) }
            break

          default:
            throw new Error('unhandled table type')
        }
      }
      return nextState
    }

    default:
      return state
  }
}
