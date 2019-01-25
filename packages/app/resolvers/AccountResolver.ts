import assert from 'assert'
import cuid from 'cuid'
import debug from 'debug'
import * as ofx4js from 'ofx4js'
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { AppContext, CancelTokenSource } from '../context'
import {
  Account,
  AccountInput,
  AccountType,
  Bank,
  Transaction,
  TransactionInput,
} from '../entities'
import { selectors } from '../reducers'
import { diff } from '../util/diff'
// import { checkLogin, createService, getFinancialAccount, toAccountType } from '../../online'
import { DbChange, dbWrite } from './dbWrite'

const log = debug('app:AccountResolver')
log.enabled = false // process.env.NODE_ENV !== 'production'

@Resolver(Account)
export class AccountResolver {
  private tokens = new Map<string, CancelTokenSource>()

  @Mutation(returns => Account)
  async saveAccount(
    @Ctx() { getState }: AppContext,
    @Arg('input') input: AccountInput,
    @Arg('accountId', { nullable: true }) accountId?: string,
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Account> {
    const app = selectors.getAppDbOrFail(getState())
    let account: Account
    let changes: any[]
    const t = Date.now()
    if (accountId) {
      account = await app.accounts.get(accountId)
      const q = diff<AccountInput>(account, input)
      changes = [Account.change.edit(t, accountId, q)]
      account.update(t, q)
    } else {
      if (!bankId) {
        throw new Error('when creating an account, bankId must be specified')
      }
      account = new Account(cuid(), bankId, input)
      accountId = account.id
      changes = [Account.change.add(t, account)]
    }
    await dbWrite(app.connection, changes)
    assert.equal(accountId, account.id)
    assert.deepEqual(account, await app.accounts.get(accountId))
    return account
  }

  @Mutation(returns => Boolean)
  async deleteAccount(
    @Ctx() { getState }: AppContext,
    @Arg('accountId') accountId: string
  ): Promise<boolean> {
    const app = selectors.getAppDbOrFail(getState())
    const t = Date.now()
    const changes = [Account.change.remove(t, accountId)]
    await dbWrite(app.connection, changes)
    return true
  }

  /*
  @Mutation(returns => Bank)
  async downloadAccountList(
    @Arg('bankId') bankId: string,
    @Arg('cancelToken') cancelToken: string
  ): Promise<Bank> {
    const bank = await this.app.banks.get(bankId)
    if (!bank.online) {
      throw new Error(`downloadAccountList: bank is not set online`)
    }

    // TODO: make bank query get this for us
    const existingAccounts = await this.app.accounts.getForBank(bank.id)
    const source = Axios.CancelToken.source()
    this.tokens.set(cancelToken, source)

    try {
      const service = createService(bank, source.token)
      const { username, password } = checkLogin(bank)
      const accountProfiles = await service.readAccountProfiles(username, password)
      if (accountProfiles.length === 0) {
        log.info('server reports no accounts')
      } else {
        log.info('accountProfiles', accountProfiles)
        const t = Date.now()
        const accounts = accountProfiles
          .map(accountProfile => toAccountInput(bank, accountProfiles, accountProfile))
          .filter((input): input is Account => input !== undefined)

        const adds = accounts
          .filter(account => !existingAccounts.find(acct => accountsEqual(account, acct)))
          .map(input => new Account(bankId, input, cuid))

        const edits = accounts
          .map(account => {
            const existingAccount = existingAccounts.find(acct => accountsEqual(account, acct))
            if (existingAccount) {
              return { id: existingAccount.id, q: Account.diff(existingAccount, account) }
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
          log.info('account changes', change)
          await this.app.write([change])
        } else {
          log.info('no account changes')
        }
      }
    } catch (ex) {
      if (!source.token.reason) {
        throw ex
      }
    } finally {
      this.tokens.delete(cancelToken)
    }

    return bank
  }
*/
  @FieldResolver(type => [Transaction])
  async transactions(
    @Ctx() { getState }: AppContext,
    @Root() account: Account,
    @Arg('start', { nullable: true }) start?: Date,
    @Arg('end', { nullable: true }) end?: Date
  ): Promise<Transaction[]> {
    const transactions = selectors.getTransactions(getState())
    const res = await transactions.getForAccount(account.id, start, end)
    log(
      '%s\n%s\n%o',
      `transactions for account ${account.id} (bank ${account.bankId})`,
      `time: BETWEEN '${start}' AND '${end}'`,
      res
    )
    return res
  }
  /*
  @Mutation(returns => Account)
  async downloadTransactions(
    @Arg('bankId') bankId: string,
    @Arg('accountId') accountId: string,
    @Arg('start') start: Date,
    @Arg('end') end: Date,
    @Arg('cancelToken') cancelToken: string
  ): Promise<Account> {
    const bank = await this.app.banks.get(bankId)
    if (!bank.online) {
      throw new Error(`downloadTransactions: bank is not set online`)
    }

    const account = await this.app.accounts.get(accountId)

    const source = Axios.CancelToken.source()
    this.tokens.set(cancelToken, source)

    try {
      const service = createService(bank, source.token)
      const bankAccount = getFinancialAccount(service, bank, account)
      const bankStatement = await bankAccount.readStatement(start, end)
      const transactionList = bankStatement.getTransactionList()
      const transactions = transactionList.getTransactions()

      if (!transactions) {
        console.log('empty transaction list')
      } else {
        console.log('transactions', transactions)

        const existingTransactions = await this.app.transactions.getForAccount(
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
          .map(tx => new Transaction(cuid, accountId, tx))

        const edits = txInputs
          .map(tx => {
            const existingTx = existingTransactions.find(etx => transactionsEqual(etx, tx))
            if (existingTx) {
              return { id: existingTx.id, q: Transaction.diff(existingTx, tx) }
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
          console.log('transaction changes', change)
          await this.app.write([change])
        } else {
          console.log('no transaction changes')
        }
      }
    } catch (ex) {
      if (!source.token.reason) {
        throw ex
      }
    } finally {
      this.tokens.delete(cancelToken)
    }

    return account
  }
*/
  @Mutation(returns => Boolean)
  async cancel(@Arg('cancelToken') cancelToken: string): Promise<boolean> {
    const source = this.tokens.get(cancelToken)
    if (!source) {
      return false
    }

    source.cancel('cancelled')
    return true
  }
}

const defined = <T>(object: T | undefined): object is T => !!object
/*
const toAccountInput = (
  bank: Bank,
  accountProfiles: ofx4js.domain.data.signup.AccountProfile[],
  accountProfile: ofx4js.domain.data.signup.AccountProfile
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
    console.log('unsupported account: investment')
  } else {
    console.log('unsupported account: ???')
  }
  return undefined
}

const accountsEqual = (a: AccountInput, b: AccountInput): boolean => {
  return a.type === b.type && a.number === b.number
}

const timeForTransaction = (tx: ofx4js.domain.data.common.Transaction): Date => tx.getDatePosted()

const toTransactionInput = (tx: ofx4js.domain.data.common.Transaction): TransactionInput => ({
  serverid: tx.getId(),
  time: timeForTransaction(tx),
  type: ofx4js.domain.data.common.TransactionType[tx.getTransactionType()],
  name: tx.getName(),
  memo: tx.getMemo() || '',
  amount: tx.getAmount(),
  // split: {}
})

const transactionsEqual = (a: TransactionInput, b: TransactionInput): boolean => {
  return a.serverid === b.serverid
}
*/
