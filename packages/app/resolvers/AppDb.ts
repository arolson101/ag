import { Arg, Ctx, Field, ObjectType } from 'type-graphql'
import { AppContext } from '../context'
import { Account, Bank, Transaction } from '../entities'
import { selectors } from '../reducers'

@ObjectType()
export class AppDb {
  @Field()
  loggedIn: boolean = true

  @Field(returns => Bank, { nullable: true })
  async bank(
    @Ctx() { getState }: AppContext, //
    @Arg('bankId', { nullable: true }) bankId?: string
  ): Promise<Bank | undefined> {
    const banks = selectors.getBanks(getState())
    return bankId ? banks.get(bankId) : undefined
  }

  @Field(returns => [Bank])
  async banks(
    @Ctx() { getState }: AppContext //
  ): Promise<Bank[]> {
    const banks = selectors.getBanks(getState())
    return banks.all()
  }

  @Field(returns => Account, { nullable: true })
  async account(
    @Ctx() { getState }: AppContext,
    @Arg('accountId', { nullable: true }) accountId?: string
  ): Promise<Account | undefined> {
    const accounts = selectors.getAccounts(getState())
    return accountId ? accounts.get(accountId) : undefined
  }

  @Field(returns => [Account])
  async accounts(
    @Ctx() { getState }: AppContext //
  ): Promise<Account[]> {
    const accounts = selectors.getAccounts(getState())
    return accounts.all()
  }

  @Field(returns => Transaction, { nullable: true })
  async transaction(
    @Ctx() { getState }: AppContext,
    @Arg('transactionId', { nullable: true }) transactionId?: string
  ): Promise<Transaction | undefined> {
    const transactions = selectors.getTransactions(getState())
    return transactionId ? transactions.get(transactionId) : undefined
  }
}
