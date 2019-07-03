import { Account, Bank, Bill, Budget, Category, DbEntity, Transaction } from '@ag/db'
import { memoizeOne, stringComparer } from '@ag/util'
import debug from 'debug'
import { memo } from 'react'
import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'

const log = debug('core:recordsReducer')

interface RecordsState {
  banks: Record<string, Bank>
  accounts: Record<string, Account>
  transactions: Record<string, Transaction>
  bills: Record<string, Bill>
  budgets: Record<string, Budget>
  categories: Record<string, Category>
}

const initialState: RecordsState = {
  banks: {},
  accounts: {},
  transactions: {},
  bills: {},
  budgets: {},
  categories: {},
}

export const recordsSelectors = {
  getBanks: (state: RecordsState): Bank[] => {
    const banks = Object.values(state.banks)
    banks.sort((a, b) => stringComparer(a.name, b.name))
    return banks
  },
  getBank: (state: RecordsState) => (bankId?: string): Bank | undefined => {
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

const applyChange = <T extends DbEntity<any>>(
  change: {
    deletes: string[]
    entities: Array<DbEntity<any>>
  },
  state: Record<string, T>
): Record<string, T> => {
  const nextState = { ...state }
  if (change.deletes) {
    for (const del of change.deletes) {
      delete nextState[del]
    }
  }
  if (change.entities) {
    for (const entity of change.entities) {
      nextState[entity.id] = entity as T
    }
  }
  return nextState
}

export const records = (state: RecordsState = initialState, action: CoreAction): RecordsState => {
  switch (action.type) {
    case getType(actions.dbLogin.request):
    case getType(actions.dbLogout):
      return initialState

    case getType(actions.dbEntities): {
      return action.payload.reduce((nextState, change) => {
        switch (change.table) {
          case Bank:
            return { ...nextState, banks: applyChange(change, nextState.banks) }

          case Account:
            return { ...nextState, accounts: applyChange(change, nextState.accounts) }

          case Transaction:
            return { ...nextState, transactions: applyChange(change, nextState.transactions) }

          case Bill:
            return { ...nextState, bills: applyChange(change, nextState.bills) }

          case Budget:
            return { ...nextState, budgets: applyChange(change, nextState.budgets) }

          case Category:
            return { ...nextState, categories: applyChange(change, nextState.categories) }

          default:
            throw new Error('unhandled table type')
        }
      }, state)
    }

    default:
      return state
  }
}
