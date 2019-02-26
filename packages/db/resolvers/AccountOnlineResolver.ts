import { diff } from '@ag/util'
import cuid from 'cuid'
import debug from 'debug'
import * as ofx4js from 'ofx4js'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { DbContext } from '../DbContext'
import {
  Account,
  AccountInput,
  AccountType,
  Bank,
  DbChange,
  Transaction,
  TransactionInput,
} from '../entities'
import { checkLogin, getFinancialAccount, ofxService, toAccountType } from '../online'
import { AppDb } from './AppDb'
import { OnlineResolver } from './OnlineResolver'

const log = debug('db:AccountOnlineResolver')

@Resolver()
export class AccountOnlineResolver {
  constructor(
    private appDb: AppDb, //
    private online: OnlineResolver
  ) {}

  @Mutation(returns => Bank)
  async downloadAccountList(
    @Ctx() context: DbContext,
    @Arg('bankId') bankId: string,
    @Arg('cancelToken') cancelToken: string
  ): Promise<Bank> {
    const app = this.appDb
    const bank = await app.bank(bankId)
    if (!bank.online) {
      throw new Error(`downloadAccountList: bank is not set online`)
    }

    // TODO: make bank query get this for us
    const existingAccounts = await app.accountsRepository!.getForBank(bank.id)
    const source = this.online.register(context, cancelToken)

    try {
      const service = ofxService({ bank, cancelToken: source.token, context })
      const { username, password } = checkLogin({ bank, context })
      const accountProfiles = await service.readAccountProfiles(username, password)
      if (accountProfiles.length === 0) {
        log('server reports no accounts')
      } else {
        log('accountProfiles', accountProfiles)
        const t = Date.now()
        const accounts = accountProfiles
          .map(accountProfile => toAccountInput(bank, accountProfiles, accountProfile))
          .filter((input): input is Account => input !== undefined)

        const adds = accounts
          .filter(account => !existingAccounts.find(acct => accountsEqual(account, acct)))
          .map(input => new Account(bankId, cuid(), input))

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
          await app.dbWrite([change])
        } else {
          log('no account changes')
        }
      }
    } catch (ex) {
      if (!source.token.reason) {
        throw ex
      }
    } finally {
      this.online.delete(cancelToken)
    }

    return bank
  }

  @Mutation(returns => Account)
  async downloadTransactions(
    @Ctx() context: DbContext,
    @Arg('bankId') bankId: string,
    @Arg('accountId') accountId: string,
    @Arg('start') start: Date,
    @Arg('end') end: Date,
    @Arg('cancelToken') cancelToken: string
  ): Promise<Account> {
    const app = this.appDb
    const bank = await app.bank(bankId)
    if (!bank.online) {
      throw new Error(`downloadTransactions: bank is not set online`)
    }

    const account = await app.account(accountId)
    const source = this.online.register(context, cancelToken)

    try {
      const service = ofxService({ bank, cancelToken: source.token, context })
      const bankAccount = getFinancialAccount({ service, bank, account, context })
      const bankStatement = await bankAccount.readStatement(start, end)
      const transactionList = bankStatement.getTransactionList()
      const transactions = transactionList.getTransactions()

      if (!transactions) {
        log('empty transaction list')
      } else {
        log('transactions', transactions)

        const existingTransactions = await app.transactionsRepository!.getForAccount(
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
          .map(tx => new Transaction(accountId, cuid(), tx))

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
          await app.dbWrite([change])
        } else {
          log('no transaction changes')
        }
      }
    } catch (ex) {
      if (!source.token.reason) {
        throw ex
      }
    } finally {
      this.online.delete(cancelToken)
    }

    return account
  }
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
