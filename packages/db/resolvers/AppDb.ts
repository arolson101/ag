import { selectors } from '@ag/core'
import debug from 'debug'
import { Arg, Ctx, Field, Mutation, ObjectType } from 'type-graphql'
import { DbContext } from '../DbContext'
import { Account, Bank, Setting, Transaction } from '../entities'

const log = debug('db:AppDb')

export interface Change {
  readonly seq?: number
  readonly text: string
}

@ObjectType()
export class AppDb {
  @Field(returns => Setting, { nullable: true })
  async get(
    @Ctx() { store }: DbContext, //
    @Arg('key') key: string
  ): Promise<Setting | undefined> {
    // log('get %s', key)
    const settingsRepo = selectors.getSettingsRepository(store.getState())
    const setting = await settingsRepo.get(key)
    return setting
  }

  @Mutation(returns => Setting, { nullable: true })
  async set(
    @Ctx() { store }: DbContext,
    @Arg('key') key: string,
    @Arg('value') value: string
  ): Promise<Setting | undefined> {
    log('set %s %s', key, value)
    const settingsRepo = selectors.getSettingsRepository(store.getState())
    const setting = await settingsRepo.set(key, value)
    return setting
  }

  @Field(returns => Bank, { nullable: true })
  async bank(
    @Ctx() { store }: DbContext, //
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank | undefined> {
    const { banksRepository } = selectors.getAppDb(store.getState())
    return bankId ? banksRepository.getById(bankId) : undefined
  }

  @Field(returns => [Bank])
  async banks(
    @Ctx() { store }: DbContext //
  ): Promise<Bank[]> {
    const { banksRepository } = selectors.getAppDb(store.getState())
    return banksRepository.all()
  }

  @Field(returns => Account, { nullable: true })
  async account(
    @Ctx() { store }: DbContext, //
    @Arg('accountId', { nullable: true }) accountId?: string
  ): Promise<Account | undefined> {
    const { accountsRepository } = selectors.getAppDb(store.getState())
    return accountId ? accountsRepository.getById(accountId) : undefined
  }

  @Field(returns => [Account])
  async accounts(
    @Ctx() { store }: DbContext //
  ): Promise<Account[]> {
    const { accountsRepository } = selectors.getAppDb(store.getState())
    return accountsRepository.all()
  }

  @Field(returns => Transaction, { nullable: true })
  async transaction(
    @Ctx() { store }: DbContext, //
    @Arg('transactionId', { nullable: true }) transactionId?: string
  ): Promise<Transaction | undefined> {
    const { transactionsRepository } = selectors.getAppDb(store.getState())
    return transactionId ? transactionsRepository.getById(transactionId) : undefined
  }
}
