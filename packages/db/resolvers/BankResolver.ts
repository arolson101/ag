import debug from 'debug'
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { DbContext } from '../DbContext'
import { Account, Bank } from '../entities'

const log = debug('db:BankResolver')

@Resolver(Bank)
export class BankResolver {
  @FieldResolver(type => [Account])
  async accounts(
    @Ctx() { getAppDb }: DbContext,
    @Root() bank: Bank //
  ): Promise<Account[]> {
    const { accountsRepository } = getAppDb()
    const res = await accountsRepository.getForBank(bank.id)
    return res
  }

  @Query(returns => Bank, { nullable: true })
  async bank(
    @Ctx() { isLoggedIn, getAppDb }: DbContext, //
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank | undefined> {
    if (isLoggedIn()) {
      const { banksRepository } = getAppDb()
      return bankId ? banksRepository.getById(bankId) : undefined
    }
  }

  @Query(returns => [Bank])
  async banks(
    @Ctx() { getAppDb }: DbContext //
  ): Promise<Bank[]> {
    const { banksRepository } = getAppDb()
    const banks = await banksRepository.all()
    banks.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
    // log('banks- %o', banks)
    return banks
  }

  @Mutation(returns => Number)
  foo(): number {
    log('foo')
    return 1
  }
}
