import { diff } from '@ag/lib-util'
import assert from 'assert'
import cuid from 'cuid'
import debug from 'debug'
import { Arg, FieldResolver, Mutation, Resolver, Root } from 'type-graphql'
import { Account, Bank, BankInput } from '../entities'
import { AppDb } from './AppDb'

const log = debug('app:BankResolver')

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
    return res.sort((a, b) => a.name.localeCompare(b.name))
  }

  @Mutation(returns => Bank)
  async saveBank(
    @Arg('input') input: BankInput,
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank> {
    const app = this.appDb
    const t = Date.now()
    let bank: Bank
    let changes: any[]
    if (bankId) {
      bank = await app.bank(bankId)
      const q = diff<BankInput>(bank, input)
      changes = [Bank.change.edit(t, bankId, q)]
      bank.update(t, q)
    } else {
      bank = new Bank(cuid(), input)
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
}
