import { selectors } from '@ag/core/reducers'
import { diff, uniqueId } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { DbContext } from '../DbContext'
import { Account, AccountInput, Bank, DbChange, Transaction } from '../entities'
import { dbWrite } from './dbWrite'

const log = debug('db:AccountResolver')

@Resolver(Account)
export class AccountResolver {
  @FieldResolver(returns => Bank)
  async bank(
    @Ctx() { store }: DbContext, //
    @Root() account: Account
  ): Promise<Bank> {
    const { banksRepository } = selectors.getAppDb(store.getState())
    return banksRepository.getById(account.bankId)
  }

  @Query(returns => Account, { nullable: true })
  async account(
    @Ctx() { store }: DbContext, //
    @Arg('accountId', { nullable: true }) accountId?: string
  ): Promise<Account | undefined> {
    const { accountsRepository } = selectors.getAppDb(store.getState())
    return accountId ? accountsRepository.getById(accountId) : undefined
  }

  @Query(returns => [Account])
  async accounts(
    @Ctx() { store }: DbContext //
  ): Promise<Account[]> {
    const { accountsRepository } = selectors.getAppDb(store.getState())
    return accountsRepository.all()
  }

  @Mutation(returns => Account)
  async saveAccount(
    @Ctx() { store }: DbContext,
    @Arg('input') input: AccountInput,
    @Arg('accountId', { nullable: true }) accountId?: string,
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Account> {
    const { connection, accountsRepository } = selectors.getAppDb(store.getState())
    let account: Account
    let changes: DbChange[]
    const t = Date.now()
    if (accountId) {
      account = await accountsRepository.getById(accountId)
      const q = diff<Account.Props>(account, input)
      changes = [Account.change.edit(t, accountId, q)]
      account.update(t, q)
    } else {
      if (!bankId) {
        throw new Error('when creating an account, bankId must be specified')
      }
      account = new Account(bankId, uniqueId(), input)
      accountId = account.id
      changes = [Account.change.add(t, account)]
    }
    await dbWrite(connection, changes)
    assert.equal(accountId, account.id)
    assert.deepEqual(account, await accountsRepository.getById(accountId))
    return account
  }

  @Mutation(returns => Boolean)
  async deleteAccount(
    @Ctx() { store }: DbContext, //
    @Arg('accountId') accountId: string
  ): Promise<boolean> {
    const { connection } = selectors.getAppDb(store.getState())
    const t = Date.now()
    const changes = [Account.change.remove(t, accountId)]
    await dbWrite(connection, changes)
    return true
  }

  @FieldResolver(type => [Transaction])
  async transactions(
    @Ctx() { store }: DbContext, //
    @Root() account: Account,
    @Arg('start', { nullable: true }) start?: Date,
    @Arg('end', { nullable: true }) end?: Date
  ): Promise<Transaction[]> {
    const { transactionsRepository } = selectors.getAppDb(store.getState())
    const res = await transactionsRepository.getForAccount(account.id, start, end)
    log(
      '%s\n%s\n%o',
      `transactions for account ${account.id} (bank ${account.bankId})`,
      `time: BETWEEN '${start}' AND '${end}'`,
      res
    )
    return res
  }
}
