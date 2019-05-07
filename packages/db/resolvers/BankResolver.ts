import { diff, uniqueId } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql'
import { DbContext } from '../DbContext'
import { Account, Bank, BankInput, DbChange, DbRecordEdit } from '../entities'
import { AppDb } from './AppDb'

const log = debug('db:BankResolver')

@Resolver(Bank)
export class BankResolver {
  constructor(private appDb: AppDb) {}

  @FieldResolver(type => [Account])
  async accounts(
    @Root() bank: Bank //
  ): Promise<Account[]> {
    const app = this.appDb
    const accounts = this.appDb.accountsRepository
    if (!accounts) {
      throw new Error('app db is not open')
    }
    const res = await accounts.getForBank(bank.id)
    return res
  }

  @Mutation(returns => Bank)
  async saveBank(
    @Ctx() context: DbContext,
    @Arg('input') input: BankInput,
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank> {
    const app = this.appDb
    const t = Date.now()
    let bank: Bank
    let changes: DbChange[]
    if (bankId) {
      bank = await app.bank(bankId)
      const q = diff<Bank.Props>(bank, input)
      changes = [Bank.change.edit(t, bankId, q)]
      bank.update(t, q)
    } else {
      bank = new Bank(uniqueId(), input)
      bankId = bank.id
      changes = [Bank.change.add(t, bank)]
    }
    // log('dbwrite %o', changes)
    await app.dbWrite(changes)
    assert.equal(bankId, bank.id)
    // log('get bank %s', bankId)
    assert.deepEqual(bank, await app.bank(bankId))
    // log('done')
    return bank
  }

  @Mutation(returns => Boolean)
  async deleteBank(
    @Arg('bankId') bankId: string //
  ): Promise<boolean> {
    const app = this.appDb
    const t = Date.now()
    const changes = [Bank.change.remove(t, bankId)]
    await app.dbWrite(changes)
    return true
  }

  @Mutation(returns => Boolean)
  async setAccountsOrder(
    @Arg('accountIds', type => [String]) accountIds: string[]
  ): Promise<boolean> {
    const app = this.appDb
    const t = Date.now()
    if (!app.accountsRepository) {
      throw new Error('db not open')
    }
    const accounts = await app.accountsRepository.getByIds(accountIds)
    if (accounts.length !== accountIds.length) {
      throw new Error('got back wrong number of accounts')
    }
    log('accounts (before) %o', accounts)
    accounts.sort((a, b) => accountIds.indexOf(a.id) - accountIds.indexOf(b.id))
    const edits = accounts.map(
      ({ id }, idx): DbRecordEdit<Account.Spec> => ({
        id,
        q: { sortOrder: { $set: idx } },
      })
    )
    log('accounts: %o, edits: %o', accounts, edits)
    const change: DbChange = {
      t,
      edits,
      table: Account,
    }
    await app.dbWrite([change])
    return true
  }
}
