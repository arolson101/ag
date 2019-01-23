import assert from 'assert'
import cuid from 'cuid'
import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql'
import { AppContext } from '../context'
import { Account, Bank, BankInput } from '../entities'
import { selectors } from '../reducers'
import { diff } from '../util/diff'
import { dbWrite } from './dbWrite'

@Resolver(Bank)
export class BankResolver {
  @FieldResolver(type => [Account])
  async accounts(
    @Root() bank: Bank, //
    @Ctx() { getState }: AppContext
  ): Promise<Account[]> {
    const accounts = selectors.getAccounts(getState())
    const res = await accounts.getForBank(bank.id)
    return res.sort((a, b) => a.name.localeCompare(b.name))
  }

  @Mutation(returns => Bank)
  async saveBank(
    @Ctx() { getState }: AppContext,
    @Arg('input') input: BankInput,
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank> {
    const app = selectors.getAppDbOrFail(getState())
    const t = Date.now()
    let bank: Bank
    let changes: any[]
    if (bankId) {
      bank = await app.banks.get(bankId)
      const q = diff<BankInput>(bank, input)
      changes = [Bank.change.edit(t, bankId, q)]
      bank.update(t, q)
    } else {
      bank = new Bank(cuid(), input)
      bankId = bank.id
      changes = [Bank.change.add(t, bank)]
    }
    await dbWrite(app.connection, changes)
    assert.equal(bankId, bank.id)
    assert.deepEqual(bank, await app.banks.get(bankId))
    return bank
  }

  @Mutation(returns => Boolean)
  async deleteBank(
    @Ctx() { getState }: AppContext,
    @Arg('bankId') bankId: string
  ): Promise<boolean> {
    const app = selectors.getAppDbOrFail(getState())
    const t = Date.now()
    const changes = [Bank.change.remove(t, bankId)]
    await dbWrite(app.connection, changes)
    return true
  }
}
