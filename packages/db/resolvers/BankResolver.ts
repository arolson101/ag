import { diff, uniqueId } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { DbContext } from '../DbContext'
import { Account, Bank, BankInput, DbChange, DbRecordEdit } from '../entities'
import { dbWrite } from './dbWrite'

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

  @Mutation(returns => Boolean)
  async setAccountsOrder(
    @Ctx() { getAppDb }: DbContext,
    @Arg('accountIds', type => [String]) accountIds: string[]
  ): Promise<boolean> {
    const { connection, accountsRepository } = getAppDb()
    const t = Date.now()
    const accounts = await accountsRepository.getByIds(accountIds)
    if (accounts.length !== accountIds.length) {
      throw new Error('got back wrong number of accounts')
    }
    // log('accounts (before) %o', accounts)
    accounts.sort((a, b) => accountIds.indexOf(a.id) - accountIds.indexOf(b.id))
    const edits = accounts.map(
      ({ id }, idx): DbRecordEdit<Account.Spec> => ({
        id,
        q: { sortOrder: { $set: idx } },
      })
    )
    // log('accounts: %o, edits: %o', accounts, edits)
    const change: DbChange = {
      t,
      edits,
      table: Account,
    }
    await dbWrite(connection, [change])
    return true
  }
}
