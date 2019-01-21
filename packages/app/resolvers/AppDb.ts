import { Arg, Ctx, Field, ObjectType } from 'type-graphql'
import { AppContext } from '../context'
import { Account, Bank, Transaction } from '../entities'
import { selectors } from '../reducers'

@ObjectType()
export class AppDb {
  @Field()
  loggedIn: boolean = true

  @Field(returns => Bank)
  async bank(
    @Ctx() { getState }: AppContext, //
    @Arg('bankId') bankId: string
  ): Promise<Bank> {
    const banks = selectors.getBanks(getState())
    return banks.get(bankId)
  }

  @Field(returns => [Bank])
  async banks(
    @Ctx() { getState }: AppContext //
  ): Promise<Bank[]> {
    const banks = selectors.getBanks(getState())
    return banks.all()
  }

  @Field(returns => Account)
  async account(
    @Ctx() { getState }: AppContext,
    @Arg('accountId') accountId: string
  ): Promise<Account> {
    const accounts = selectors.getAccounts(getState())
    return accounts.get(accountId)
  }

  @Field(returns => [Account])
  async accounts(
    @Ctx() { getState }: AppContext //
  ): Promise<Account[]> {
    const accounts = selectors.getAccounts(getState())
    return accounts.all()
  }

  @Field(returns => Transaction)
  async transaction(
    @Ctx() { getState }: AppContext,
    @Arg('transactionId') transactionId: string
  ): Promise<Transaction> {
    const transactions = selectors.getTransactions(getState())
    return transactions.get(transactionId)
  }
}
