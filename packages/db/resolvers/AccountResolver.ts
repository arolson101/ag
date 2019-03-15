import { diff } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { Arg, Ctx, Field, FieldResolver, Mutation, Resolver, Root } from 'type-graphql'
import { DbContext } from '../DbContext'
import { Account, AccountInput, Bank, Transaction } from '../entities'
import { AppDb } from './AppDb'

const log = debug('db:AccountResolver')

@Resolver(Account)
export class AccountResolver {
  constructor(
    private appDb: AppDb //
  ) {}

  @FieldResolver(returns => Bank)
  async bank(@Root() account: Account): Promise<Bank> {
    const app = this.appDb
    return app.bank(account.bankId)
  }

  @Mutation(returns => Account)
  async saveAccount(
    @Ctx() context: DbContext,
    @Arg('input') input: AccountInput,
    @Arg('accountId', { nullable: true }) accountId?: string,
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Account> {
    const app = this.appDb
    let account: Account
    let changes: any[]
    const t = Date.now()
    if (accountId) {
      account = await app.account(accountId)
      const q = diff<AccountInput>(account, input)
      changes = [Account.change.edit(t, accountId, q)]
      account.update(t, q)
    } else {
      if (!bankId) {
        throw new Error('when creating an account, bankId must be specified')
      }
      const { uniqueId } = context
      account = new Account(bankId, uniqueId(), input)
      accountId = account.id
      changes = [Account.change.add(t, account)]
    }
    await app.dbWrite(changes)
    assert.equal(accountId, account.id)
    assert.deepEqual(account, await app.account(accountId))
    return account
  }

  @Mutation(returns => Boolean)
  async deleteAccount(@Arg('accountId') accountId: string): Promise<boolean> {
    const app = this.appDb
    const t = Date.now()
    const changes = [Account.change.remove(t, accountId)]
    await app.dbWrite(changes)
    return true
  }

  @FieldResolver(type => [Transaction])
  async transactions(
    @Root() account: Account,
    @Arg('start', { nullable: true }) start?: Date,
    @Arg('end', { nullable: true }) end?: Date
  ): Promise<Transaction[]> {
    const app = this.appDb
    const transactions = app.transactionsRepository
    if (!transactions) {
      throw new Error('app db is not open')
    }
    const res = await transactions.getForAccount(account.id, start, end)
    log(
      '%s\n%s\n%o',
      `transactions for account ${account.id} (bank ${account.bankId})`,
      `time: BETWEEN '${start}' AND '${end}'`,
      res
    )
    return res
  }
}
