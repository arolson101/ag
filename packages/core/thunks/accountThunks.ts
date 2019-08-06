import {
  Account,
  AccountInput,
  AccountType,
  Bank,
  DbChange,
  Image,
  Transaction,
  TransactionInput,
} from '@ag/db/entities'
import { ofx4js, toAccountType } from '@ag/online'
import { diff, uniqueId } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'
import { dbWrite } from './dbWrite'

const log = debug('db:accountThunks')

interface SaveAccountParams {
  input: AccountInput
  accountId?: string
  bankId?: string
}

const saveAccount = ({ input, accountId, bankId }: SaveAccountParams): CoreThunk =>
  async function _saveAccount(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const { accountRepository } = selectors.appDb(state)

      let account: Account
      let changes: DbChange[]
      const t = Date.now()

      const [iconId, iconChange] = Image.change.create(t, input.iconId)
      input.iconId = iconId

      if (accountId) {
        account = await accountRepository.getById(accountId)
        const q = diff<Account.Props>(account, input)
        changes = [Account.change.edit(t, accountId, q), ...iconChange]
        account.update(t, q)
      } else {
        if (!bankId) {
          throw new Error('when creating an account, bankId must be specified')
        }
        account = new Account(bankId, uniqueId(), input)
        accountId = account.id
        changes = [Account.change.add(t, account), ...iconChange]
      }
      await dispatch(dbWrite(changes))
      assert.equal(accountId, account.id)
      assert.deepStrictEqual(account, await accountRepository.getById(accountId))

      const intlCtx = { name: account.name }
      showToast(intl.formatMessage(accountId ? messages.saved : messages.created, intlCtx))
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

const deleteAccount = (account: { id: string; name: string }): CoreThunk =>
  async function _deleteAccount(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const intlCtx = { name: account.name }

      const confirmed = await alert({
        title: intl.formatMessage(messages.title),
        body: intl.formatMessage(messages.deleteAccountBody, intlCtx),
        danger: true,

        confirmText: intl.formatMessage(messages.deleteAccountConfirm),
        cancelText: intl.formatMessage(messages.cancel),
      })

      if (confirmed) {
        const t = Date.now()
        const changes = [Account.change.remove(t, account.id)]
        await dispatch(dbWrite(changes))
        showToast(intl.formatMessage(messages.deleted, intlCtx), true)
      }
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

const syncAccounts = (bankId: string): CoreThunk =>
  async function _syncAccounts(dispatch) {
    await dispatch(downloadAccountList(bankId))
  }

const downloadAccountList = (bankId: string): CoreThunk =>
  async function _downloadAccountList(dispatch, getState, { online }) {
    const state = getState()
    const intl = selectors.intl(state)
    try {
      const { bankRepository, accountRepository } = selectors.appDb(state)
      const bank = await bankRepository.getById(bankId)
      if (!bank.online) {
        throw new Error(`downloadAccountList: bank is not set online`)
      }

      // TODO: make bank query get this for us
      const existingAccounts = await accountRepository.getForBank(bank.id)
      const source = online.CancelToken.source()

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
            table: 'account',
            t,
            adds,
            edits,
          }
          log('account changes', change)
          await dispatch(dbWrite([change]))
        } else {
          log('no account changes')
        }
      }
    } catch (ex) {
      if (!online.isCancel(ex)) {
        throw ex
      }
    }
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
    const intl = selectors.intl(state)
    const { bankRepository, accountRepository, transactionRepository } = selectors.appDb(state)
    const bank = await bankRepository.getById(bankId)
    if (!bank.online) {
      throw new Error(`downloadTransactions: bank is not set online`)
    }

    const account = await accountRepository.getById(accountId)
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

        const existingTransactions = await transactionRepository.getForAccount(
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
            table: 'transaction',
            t,
            adds,
            edits,
          }
          log('transaction changes', change)
          await dispatch(dbWrite([change]))
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
  saveAccount,
  deleteAccount,
  syncAccounts,
  downloadAccountList,
  downloadTransactions,
}

const messages = defineMessages({
  title: {
    id: 'accountThunks.title',
    defaultMessage: 'Are you sure?',
  },
  deleteAccountBody: {
    id: 'accountThunks.deleteAccountBody',
    defaultMessage: "This will delete the account '{name}' and all its transactions",
  },
  deleteAccountConfirm: {
    id: 'accountThunks.deleteAccountConfirm',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'accountThunks.cancel',
    defaultMessage: 'Cancel',
  },
  deleted: {
    id: 'accountThunks.deleted',
    defaultMessage: "Account '{name}' deleted",
  },
  saved: {
    id: 'AccountForm.saved',
    defaultMessage: "Account '{name}' saved",
  },
  created: {
    id: 'AccountForm.created',
    defaultMessage: "Account '{name}' added",
  },
})
