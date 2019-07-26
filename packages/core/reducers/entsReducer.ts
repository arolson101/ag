import { Account, Bank, Bill, Budget, Category, DbEntity, Image, Transaction } from '@ag/db'
import { stringComparer } from '@ag/util'
import debug from 'debug'
import { getType } from 'typesafe-actions'
import { actions, CoreAction } from '../actions'
import { ImageSrc } from '../context'

const log = debug('core:recordsReducer')

interface EntsState {
  banks: Record<string, Bank>
  accounts: Record<string, Account>
  transactions: Record<string, Transaction>
  bills: Record<string, Bill>
  budgets: Record<string, Budget>
  categories: Record<string, Category>
  images: Record<string, Image>
}

const initialState: EntsState = {
  banks: {},
  accounts: {},
  transactions: {},
  bills: {},
  budgets: {},
  categories: {},
  images: {},
}

export const entsSelectors = {
  banks: (state: EntsState): Bank[] => {
    const banks = Object.values(state.banks)
    banks.sort((a, b) => stringComparer(a.name, b.name))
    return banks
  },
  getBank: (state: EntsState) => (bankId?: string): Bank | undefined => {
    return bankId ? state.banks[bankId] : undefined
  },
  getAccountsForBank: (state: EntsState) => (bankId: string): Account[] => {
    const accounts: Account[] = []
    for (const account of Object.values(state.accounts)) {
      if (account.bankId === bankId) {
        accounts.push(account)
      }
    }
    accounts.sort((a, b) => a.sortOrder - b.sortOrder)
    return accounts
  },
  getAccount: (state: EntsState) => (accountId?: string): Account | undefined => {
    return accountId ? state.accounts[accountId] : undefined
  },
  accounts: (state: EntsState): Account[] => {
    const accounts = Object.values(state.accounts)
    accounts.sort((a, b) => stringComparer(a.name, b.name))
    return accounts
  },
  getTransactions: (state: EntsState) => (accountId: string): Transaction[] => {
    return Object.values(state.transactions).filter(t => t.accountId === accountId)
  },
  getTransaction: (state: EntsState) => (transactionId?: string): Transaction | undefined => {
    return transactionId ? state.transactions[transactionId] : undefined
  },
  bills: (state: EntsState) => {
    const bills = Object.values(state.bills)
    bills.sort((a, b) => a.sortOrder - b.sortOrder)
    return bills
  },
  getBill: (state: EntsState) => (billId?: string) => (billId ? state.bills[billId] : undefined),
  getImage: (state: EntsState) => (imageId: string): ImageSrc | undefined => state.images[imageId],
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

export const ents = (state: EntsState = initialState, action: CoreAction): EntsState => {
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

          case Bill:
            return { ...nextState, bills: applyChange(change, nextState.bills) }

          case Budget:
            return { ...nextState, budgets: applyChange(change, nextState.budgets) }

          case Category:
            return { ...nextState, categories: applyChange(change, nextState.categories) }

          case Transaction:
            return { ...nextState, transactions: applyChange(change, nextState.transactions) }

          case Image:
            return { ...nextState, images: applyChange(change, nextState.images) }

          default:
            throw new Error('unhandled table type')
        }
      }, state)
    }

    case getType(actions.imageLoaded): {
      const image = action.payload.image
      return { ...state, images: { ...state.images, [image.id]: image } }
    }

    default:
      return state
  }
}
