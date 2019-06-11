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
    @Ctx() { getAppDb }: DbContext, //
    @Root() account: Account
  ): Promise<Bank> {
    const { banksRepository } = getAppDb()
    return banksRepository.getById(account.bankId)
  }

  @Query(returns => Account, { nullable: true })
  async account(
    @Ctx() { getAppDb }: DbContext, //
    @Arg('accountId', { nullable: true }) accountId?: string
  ): Promise<Account | undefined> {
    const { accountsRepository } = getAppDb()
    return accountId ? accountsRepository.getById(accountId) : undefined
  }

  @Query(returns => [Account])
  async accounts(
    @Ctx() { getAppDb }: DbContext //
  ): Promise<Account[]> {
    const { accountsRepository } = getAppDb()
    return accountsRepository.all()
  }

  @FieldResolver(type => [Transaction])
  async transactions(
    @Ctx() { getAppDb }: DbContext, //
    @Root() account: Account,
    @Arg('start', { nullable: true }) start?: Date,
    @Arg('end', { nullable: true }) end?: Date
  ): Promise<Transaction[]> {
    const { transactionsRepository } = getAppDb()
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
