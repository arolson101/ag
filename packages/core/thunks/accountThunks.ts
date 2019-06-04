import {
  Account,
  AccountInput,
  AccountType,
  Bank,
  DbChange,
  Transaction,
  TransactionInput,
} from '@ag/db/entities'
import { dbWrite } from '@ag/db/resolvers/dbWrite'
import { toAccountType } from '@ag/online'
import { diff, uniqueId } from '@ag/util'
import debug from 'debug'
import * as ofx4js from 'ofx4js'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'

const log = debug('db:AccountOnlineResolver')

const syncAccounts = (bankId: string): CoreThunk =>
  async function _syncAccounts(dispatch) {
    await dispatch(downloadAccountList(bankId))
  }

const downloadAccountList = (bankId: string): CoreThunk<Bank> =>
  async function _downloadAccountList(dispatch, getState, { online }) {
    const state = getState()
    const intl = selectors.getIntl(state)
    const { connection, banksRepository, accountsRepository } = selectors.getAppDb(state)
    const bank = await banksRepository.getById(bankId)
    if (!bank.online) {
      throw new Error(`downloadAccountList: bank is not set online`)
    }

    // TODO: make bank query get this for us
    const existingAccounts = await accountsRepository.getForBank(bank.id)
    const source = online.CancelToken.source()

    try {
      const accountProfiles = await online.getAccountList(bank, bank, source.token, intl)
      if (accountProfiles.length === 0) {
        log('server reports no accounts')
      } else {
        log('accountProfiles', accountProfiles)
        const t = Date.now()
        const accounts = accountProfiles
          .map(accountProfile => toAccountInput(bank, accountProfiles, accountProfile))
          .filter((input): input is Account => !!input)

        const adds = accounts
          .filter(account => !existingAccounts.find(acct => accountsEqual(account, acct)))
          .map(input => new Account(bankId, uniqueId(), input))

        const edits = accounts
          .map(account => {
            const existingAccount = existingAccounts.find(acct => accountsEqual(account, acct))
            if (existingAccount) {
              return { id: existingAccount.id, q: diff(existingAccount, account) }
            } else {
              return undefined
            }
          })
          .filter(defined)
          .filter(change => Object.keys(change.q).length > 0)

        if (adds.length || edits.length) {
          const change: DbChange = {
            table: Account,
            t,
            adds,
            edits,
          }
          log('account changes', change)
          await dbWrite(connection, [change])
        } else {
          log('no account changes')
        }
      }
    } catch (ex) {
      if (!online.isCancel(ex)) {
        throw ex
      }
    }

    return bank
  }

const downloadTransactions = ({
  bankId,
  accountId,
  start,
  end,
}: {
  bankId: string
  accountId: string
  start: Date
  end: Date
}): CoreThunk<Account> =>
  async function _downloadTransactions(dispatch, getState, { online }) {
    const state = getState()
    const intl = selectors.getIntl(state)
    const {
      connection,
      banksRepository,
      accountsRepository,
      transactionsRepository,
    } = selectors.getAppDb(state)
    const bank = await banksRepository.getById(bankId)
    if (!bank.online) {
      throw new Error(`downloadTransactions: bank is not set online`)
    }

    const account = await accountsRepository.getById(accountId)
    const source = online.CancelToken.source()

    try {
      const transactions = await online.getTransactions({
        intl,
        login: bank,
        account,
        cancelToken: source.token,
        start,
        end,
        serverInfo: bank,
      })

      if (!transactions) {
        log('empty transaction list')
      } else {
        log('transactions', transactions)

        const existingTransactions = await transactionsRepository.getForAccount(
          account.id,
          start,
          end
        )

        const inDateRange = (tx: TransactionInput): boolean => {
          return tx.time !== undefined && tx.time >= start && tx.time <= end
        }

        const t = Date.now()

        const txInputs = transactions.map(toTransactionInput).filter(inDateRange)

        const adds = txInputs
          .filter(tx => !existingTransactions.find(etx => transactionsEqual(etx, tx)))
          .map(tx => new Transaction(accountId, uniqueId(), tx))

        const edits = txInputs
          .map(tx => {
            const existingTx = existingTransactions.find(etx => transactionsEqual(etx, tx))
            if (existingTx) {
              return { id: existingTx.id, q: diff(existingTx, tx) }
            } else {
              return
            }
          })
          .filter(defined)
          .filter(change => Object.keys(change.q).length > 0)

        if (adds.length || edits.length) {
          const change: DbChange = {
            table: Transaction,
            t,
            adds,
            edits,
          }
          log('transaction changes', change)
          await dbWrite(connection, [change])
        } else {
          log('no transaction changes')
        }
      }
    } catch (ex) {
      if (!online.isCancel(ex)) {
        throw ex
      }
    }

    return account
  }

const defined = <T>(object: T | undefined): object is T => !!object

const toAccountInput = (
  bank: Bank,
  accountProfiles: ofx4js.AccountProfile[],
  accountProfile: ofx4js.AccountProfile
): AccountInput | undefined => {
  const name =
    accountProfile.getDescription() ||
    (accountProfiles.length === 1
      ? bank.name
      : `${bank.name} ${accountProfiles.indexOf(accountProfile)}`)

  if (accountProfile.getBankSpecifics()) {
    const bankSpecifics = accountProfile.getBankSpecifics()
    const bankAccount = bankSpecifics.getBankAccount()
    // bankAccount.getBranchId()
    return {
      name,
      routing: bankAccount.getBankId(),
      type: toAccountType(bankAccount.getAccountType()),
      number: bankAccount.getAccountNumber(),
    }
  } else if (accountProfile.getCreditCardSpecifics()) {
    const creditCardSpecifics = accountProfile.getCreditCardSpecifics()
    const creditCardAccount = creditCardSpecifics.getCreditCardAccount()
    return {
      name,
      type: AccountType.CREDITCARD,
      number: creditCardAccount.getAccountNumber(),
      key: creditCardAccount.getAccountKey() || '',
    }
  } else if (accountProfile.getInvestmentSpecifics()) {
    // TODO: support investment accounts
    log('unsupported account: investment')
  } else {
    log('unsupported account: ???')
  }
  return undefined
}

const accountsEqual = (a: AccountInput, b: AccountInput): boolean => {
  return a.type === b.type && a.number === b.number
}

const timeForTransaction = (tx: ofx4js.Transaction): Date => tx.getDatePosted()

const toTransactionInput = (tx: ofx4js.Transaction): TransactionInput => ({
  serverid: tx.getId(),
  time: timeForTransaction(tx),
  type: ofx4js.TransactionType[tx.getTransactionType()],
  name: tx.getName(),
  memo: tx.getMemo() || '',
  amount: tx.getAmount(),
  // split: {}
})

const transactionsEqual = (a: TransactionInput, b: TransactionInput): boolean => {
  return a.serverid === b.serverid
}

export const accountThunks = {
  syncAccounts, //
  downloadAccountList,
  downloadTransactions,
}