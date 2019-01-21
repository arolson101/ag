import cuid from 'cuid'
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { AppContext } from '../context'
import { Account, Bank, BankInput } from '../entities'
import { selectors } from '../reducers'

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
  /*
  @Mutation(returns => Bank)
  async saveBank(
    @Arg('input') input: BankInput,
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank> {
    const t = Date.now()
    let bank: Bank
    let changes: any[]
    if (bankId) {
      bank = await this.app.banks.get(bankId)
      const q = Bank.diff(bank, input)
      changes = [Bank.change.edit(t, bankId, q)]
      bank.update(q)
    } else {
      bank = new Bank(input, cuid)
      changes = [Bank.change.add(t, bank)]
    }
    await this.app.write(changes)
    return bank
  }

  @Mutation(returns => Boolean)
  async deleteBank(@Arg('bankId') bankId: string): Promise<Boolean> {
    const t = Date.now()
    const changes = [Bank.change.remove(t, bankId)]
    await this.app.write(changes)
    return true
  }
  */
}
