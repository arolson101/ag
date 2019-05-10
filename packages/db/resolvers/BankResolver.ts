import { selectors } from '@ag/core'
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
    @Ctx() { store }: DbContext,
    @Root() bank: Bank //
  ): Promise<Account[]> {
    const { accountsRepository } = selectors.getAppDb(store.getState())
    const res = await accountsRepository.getForBank(bank.id)
    return res
  }

  @Query(returns => Bank, { nullable: true })
  async bank(
    @Ctx() { store }: DbContext, //
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank | undefined> {
    if (selectors.isLoggedIn(store.getState())) {
      const { banksRepository } = selectors.getAppDb(store.getState())
      return bankId ? banksRepository.getById(bankId) : undefined
    }
  }

  @Query(returns => [Bank])
  async banks(
    @Ctx() { store }: DbContext //
  ): Promise<Bank[]> {
    const { banksRepository } = selectors.getAppDb(store.getState())
    const banks = await banksRepository.all()
    // log('banks- %o', banks)
    return banks
  }

  @Mutation(returns => Bank)
  async saveBank(
    @Ctx() { store }: DbContext,
    @Arg('input') input: BankInput,
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank> {
    const state = store.getState()
    const { connection, banksRepository } = selectors.getAppDb(state)
    const t = Date.now()
    let bank: Bank
    let changes: DbChange[]
    if (bankId) {
      bank = await banksRepository.getById(bankId)
      const q = diff<Bank.Props>(bank, input)
      changes = [Bank.change.edit(t, bankId, q)]
      bank.update(t, q)
    } else {
      bank = new Bank(uniqueId(), input)
      bankId = bank.id
      changes = [Bank.change.add(t, bank)]
    }
    // log('dbwrite %o', changes)
    await dbWrite(connection, changes)
    assert.equal(bankId, bank.id)
    // log('get bank %s', bankId)
    assert.deepEqual(bank, await banksRepository.getById(bankId))
    // log('done')
    return bank
  }

  @Mutation(returns => Boolean)
  async deleteBank(
    @Ctx() { store }: DbContext,
    @Arg('bankId') bankId: string //
  ): Promise<boolean> {
    const { connection } = selectors.getAppDb(store.getState())
    const t = Date.now()
    const changes = [Bank.change.remove(t, bankId)]
    await dbWrite(connection, changes)
    return true
  }

  @Mutation(returns => Boolean)
  async setAccountsOrder(
    @Ctx() { store }: DbContext,
    @Arg('accountIds', type => [String]) accountIds: string[]
  ): Promise<boolean> {
    const { connection, accountsRepository } = selectors.getAppDb(store.getState())
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
